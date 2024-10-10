@def title = "Scalene - A Python Profiler Case Study"
@def published = "4 July 2023"
@def description = "A short note of ideas used in the high-performance python profiler - Scalene"
@def tags = ["python", "profiling", "memory"]
@def has_math = true
@def has_chart = false
@def has_code = false
@def show_info = true
@def is_draft = false
@def is_index = false

&emsp; What makes a good profiler for scientific computing tasks?

1. **Line-by-line profiling** - Usually profilers are designed based on two level of granularity - line or functional level. This requirement varies by application but for scientific computations, line-level granularity is desired since functions themselves could be quite complex. This becomes all the more pertinent when an another language  does the computational weight-lifting.


2. **Low overhead** - This is one the most important requirements of any profiler. The commonly used profilers are developed in low level languages. For scripting languages they are then wrapped in the corresponding language - for instance, `cProfile` for Python. Note that the overhead and the granularity level are inversely related as function-level profilers often have lower overhead.
   
3. **Both time and memory profiling** - Programs are often prone to memory leaks[^1]. Tracking memory usage is crucial for scientific applications. While tools like Valgrind so exist, it is sometimes desirable for the profiler to report both time and memory usage at the same granularity. There needs to be a trade-off here since profiling both time and memory increases the overhead considerably.
   
4. **Profile across multiple threads and processes** - Scientific computations are often parallelised to run across multiple threads and processes leveraging the underlying architecture of the hardware. So, it is crucial that the profiler be able to handle such parallel / distributed tasks.


5. **Support GPU profiling** - Since the advent of accessible libraries like CUDA, much of modern scientific computation runs of the GPU. Thus, it is desirable for the profiler to handle both CPU and GPU workloads.

Additionally, it goes without saying that the reported numbers must be accurate.


### Scalene


&emsp; Scalene[^git] sets out to accomplish all the above goals and more - for the Python language[^2]. Scalene's focus on computational code leverages the fact that the performant parts of the Python code is written in a lower-level compiled language like C/C++. As such, the profiler includes both the times spent on python code as well as some native C/C++ code. This also enables scalene to report both the CPU and wall-clock times. 

Additional features of Scalene includes cross-platform profiling and copy volume tracking. Copy volume tracking is especially wonderful to have to identify and track any implicit data duplication at the language interface - like in the `numpy` library.

There are 3 main components of Scalene that enable fast accurate profiling - The signal handler, a custom memory allocator, and a sampler. The following diagram illustrates the way the three component operate during code profiling.

!!!
<img  style="width:85%;min-width:400px;" src="/media/post_images/Scalene.svg" alt="Scalene">
!!!

1. *Signal Handler* - The core of Scalene is its signal handler that tracks, queues, channels, and interrupts system signals. Scalene reads these signals to track and profile both time and memory usage. Many scripting / interpreted languages deliver system signals directly to the main thread. This means that is a signal is delayed, that means the time spent *outside* the interpreter, otherwise, the time must have been spent running the python native code.
   
    This works well for single-threaded programs. For multi-threaded programs, the signals may be blocked another other threads to join. To ensure that these signals are always received by the main thread, Scalene uses a feature of dynamic languages called *monkey patching* - a dynamic modification of code at runtime. This allows the main thread to receive signals from C/C++ code and from different python threads even if they are blocking. Luckily Python still (as of this writing) uses the Global Interpreter Lock (GIL), so Scalene can simply replicate its monkey patching across the different process-GILs in case of multi-processing programs. 

    Scalene uses Python's `dis` module (for *bytecode disassembly*) to scan the bytecode to closely track any and every call to external C/C++ function using the `CALL`, `CALL_FUNCTION`, or `CALL_METHOD` bytecodes. This enables time profiling for pure python code as well as native C/C++ code.
    To queue and track signals, Scalene simply logs them in a temporary file based on their process id. This avoids signal loss and race conditions.


2. *Memory Allocator* - As with time, Scalene tracks memory usage from `malloc` and `free` calls and Python's internal memory allocator. To reduce the overload of system memory allocator, Scalene comes with its own more efficient memory allocation that can channel memory signals back to the signal handler without any code injection during runtime. A cool thing about this is that it's is done cross-platform!

    It is important to note that profiling the memory with an allocator of different characteristics does not necessarily reflect the actual memory usage of the program with the default allocator. As such, Scalene's memory profiler is designed to closely follow Python's default memory allocator but with lower overhead using flags. Furthermore, the new memory allocator tracks the `free` signals for those objects whose corresponding `malloc` signal was interrupted. In this way, freeing foreign objects does not affect the accuracy of the memory profiler. 
    
    Tracking the `malloc` and `free` signals also help in detecting memory leakage. The *leak score* is computed using Laplace's rule of succession. Given a history of `free` and `malloc`, we can consider then as a Bernoulli trial - with success being successful memory reclaims  (`free`) and failures being non-reclaims(`malloc - free`). Laplace's rule states that the probability, then the probability of another non-reclaim is `1- |free| + 1 / (|malloc - free| + 2)`. At the end of the profiling, if this leak probability is high, then the user is warned that a leak may have occurred.

    The memory allocator also intercepts `memcpy` to track expensive copies of data - this is especially useful in CPU-GPU applications.

3. *Sampler* - Scalene chooses a non-deterministic sampling approach to poll time and memory usage to lower the overhead. Scalene samples every 0.01s by default. For memory profiling, Scalene employs *Threshold-based sampling*. Usually, a sampler is triggered at a rate proportional to the memory allocated or freed. However, this sampling can pose considerable overhead, especially in high-memory-usage programs. In threshold-based sampling, a counter keeps track of number of allocations $A$ and frees $F$ and a sample is triggered only when $|A - F| \geq T$ where $T$ is a prime-values memory threshold. Only when the memory activity is high, sampled are triggered. This leads to reduced number of samples and lower overhead. This also reduces inaccracte reportings due to short-lived objects created by the interpreter itself.


Overall, I have been quite impressed with Scalene and have been using it in most of my projects lately. With the upcoming nno-GIL option in python[^nogil], it would be interesting to track to evolution of Scalene along with the rest of the scientific Python ecosystem.


------

[^1]: Even garbage collected languages are prone to memory leaks. This [article](http://jorendorff.blogspot.com/2013/04/the-halting-problem-and-garbage.html) provides a simple example connecting the halting problem and garbage collection to shed light on why this is the case.

[^git]: Github Repository: [https://github.com/plasma-umass/scalene](https://github.com/plasma-umass/scalene)

[^2]: Although the main author of Scalene argues that these ideas can be easily applied for profiling most scripting languages.

[^nogil]: Refer: [PEP 703 – Making the Global Interpreter Lock Optional in CPython](https://peps.python.org/pep-0703/)
