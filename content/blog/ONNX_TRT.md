@def title = "Serving ONNX and TensorRT Models"
@def published = "27 October 2024"
@def description = "Notes on serving ONNX and TensorRT models"
@def tags = ["math","ml", "code", "information-theory"]
@def is_draft = true
@def show_info = true
@def has_code = false
@def has_chart = false
@def has_math = true

&emsp; Recently, I was tasked to serve an E2E solution with ONNX and TensorRT models, as part of an interview assignment. It was quite new and interesting to me, and my previous foray into serving ML models was quite limited. I had previously deployed ONNX models with TensorRT backend on NVIDIA devices.

## A Quick Background

TensorRT is a both a backend and a runtime. ONNX is an open-source format representing computational graphs that supports multiple runtimes - including TensorRT and its own runtime called ONNXRuntime. Understanding this, gave me much clarity in how to actually use these, as there are many ways to serve models.

Torchscript is yet another format used by PyTorch, that also represents a computational graph.

A simple thumb rule is that, a runtime requires a engine with I/O mapping.

## Designing the Solution
In this task, we shall use FastPitch and HiFiGAN models. FastPitch is a text-to-mel-spectrogram model, and HiFiGAN is a mel-spectrogram-to-waveform model. Linked together, they form a E2E text-to-speech pipeline.

### Converting models to ONNX and TensorRT

Converting a model to TensorRT can be done in two ways - using `trtexec` CLI tool or using the TensorRT Python API. Note that torch_tensort is does not produce a TensorRT model, but simple a serialized torchscript graph with operations executed in TensorRT.


### Creating the Server

### Testing the Server

## Conclusion
