@def title = "A Gödelian Argument for the Superiority of the Human Mind"
@def published = "14 August 2021"
@def description = "A discussion of an argument that no Turing Machine can adequately mimic human cognitive abilities, following Gödel's theorems."
@def tags = ["philosophy", "ai", "math"]
@def has_math = true
@def has_chart = false
@def has_code = false
@def show_info = true
@def is_draft = false
@def is_index = false


&emsp; Can machines be as _intelligent_ as us Humans? There seems to be a significant consensus-driven effort to realise this. Somehow, the time when machine intelligence will be commensurate with human intelligence is always thirty to fifty years away. Many will agree that at this state of affairs, we would have achieved _artificial general intelligence_ (AGI). 

The mechanistic view that a machine, more specifically a Turing machine, can adequately match human cognitive abilities is called as the _Computational Theory of Mind_ or simply _mechanism_. This theory, apart from the pursuit of AGI, drives much of neuroscience, and even philosophy. Cartesian statements like "I think, therefore I am", "you are your brain" flash before us. Everything from perception, thought, consciousness, and belief is in our brain, posits the theory. A fundamental challenge to this theory was posed by the philosopher John Lucas in the early 1960s. 

Shortly after Gödel's incompleteness theorems were made more accessible by Ernest Nagel and Thomas Newman through their 1958 book _Gödel's Proof_ [^1], philosopher John Lucas published his argument for the superiority of human mind over machines [^2] based on them. By superiority I mean that human mind cannot be adequately represented by any machine. There is always at least one thing that a human mind can do that no machine can.

Lucas' argument is as follows. 
1) Let a $\fF$ be a formal system for arithmetics. A formal system is an abstract axiomatic system where the axioms and theorems are merely strings of symbols strewn together by rules of transformation, and a proof is a sequence of strings operated according to some finite rules of inference; the theorems characterize the actual properties of the system that is modelled. Importantly, _there is no reasoning in a formal system_ - merely valid manipulation of symbols [^3]. 
2) Let a Turing machine $\fM$ be constructed such that it produces the theorems of arithmetic. This mechanization is possible due to the valiant formalization of arithmetics following Russel and Whitehead's work in the _Principa Mathematica_. Thus, the Turing machine $\fM$ is said to be analogous to the formal system for arithmetics $\fF$. The symbols can be specific states of the Turing machine and the rules of inference can be the transition function. Therefore, the theorems produced by $M$ can be formally mapped to $\fF$ and verified manually. Every provable theorem in $\fF$ will be outputted by $\fM$ and every output of $\fM$ will be a valid theorem in $\fF$.
3) A Gödelian statement can now be constructed within this formal system. A Gödelian statement is one which references itself - specifically its provability. For instance, the statement "A formula $G$ is unprovable within $\fF$" is a Gödelian statement. As mentioned earlier, there are no statements in a formal system - simply formulas. This statement can be mapped to a formula within the formal system $\fF$ [^4]. Gödel also showed that any formal system that characterizes arithmetics always allows for Gödelian statements to be constructed.
4) Following Gödel's second incompleteness theorem, the above Gödelian formula is unprovable within $\fF$ (and consequently $\fM$). However, from our meta-mathematical reasoning, we clearly see that the statement is indeed unprovable following Gödel's arguments. Therefore,using our mind to understand Gödel's theorems a true statement is indeed unprovable by a Turing machine.
   
The core of Lucas' clever argument is to let the formal system be a machine and the meta-mathematical statements be our mind; therefore showing there are things within our mind that is undecidable by any Turing machine. 

This is one of those ideas that is difficult to contend with - easy to disagree yet hard to argue against. Naturally there has been a slew of objections to Lucas' argument. Philosophy professor Jason Megill [provides]((https://iep.utm.edu/lp-argue/)) a good overview of the anti-mechanism debate instigated by Lucas. 

Lucas' argument is founded on the implicit assumption that we, humans, are consistent, *i.e.* the mind can always deduce that a statement is either true or its negation is true but not both. If the human mind is to show that the Gödelian statement from $\fM$ is indeed true, then it necessitates that the mind is consistent. This is the base upon which majority of the counter arguments are stacked up, since, following the second incompleteness theorem again, we cannot prove the consistency of our own minds. The debate continues to this day scrutinizing the consistency of our minds.

A simple mechanistic resolution is that human minds are inconsistent, so are Turing machines and therefore, both are equivalent. The goal of is then to mimic the inconsistent system of the human mind through machines. However, I would like to understand it in a different way and I am willing to be proved wrong. 

What most people mean by mimicking the mind is to mimic is its consciousness - the self-referential system and not merely the physical form of our brain. Lucas' argument, however, does not elucidate what exactly is meant by mimicking the human mind, so I shall presume the harder consciousness (and hence intelligence). A view exists that the brain is just a syntactic engine while the consciousness is the emergent property of this syntactic engine. In other words, consciousness is the functional semantic form emerged from the syntactic brain. I like to think of Lucas' proof as showing that consciousness is to the physical brain what  meta-mathematics is to the formal system. Consciousness is indeed more capable than a mere physical brain. 

I understand that the brain is not the only hardware intelligence center, there has been increasing evidence[^5] that intelligence may be found outside of the brain.  My point here is that every element in the human body that can be considered as hardware for intelligence does not explain the whole story, by Lucas' argument. Consciousness is not merely the hardware or the brain, although there is a strong causal dependency. 

Formal systems and meta-mathematics are separate and one does not stem from the other. Strings and statements are merely mapped onto each other. However, in case of consciousness and the brain, consciousness can be an _emergent property_ of the brain. To paraphrase Douglas Hofstadter, consciousness is more than just the sum of its parts. An emergent property of a system is not simply reducible to its parts and Lucas' proof may indicate the same about our consciousness. This way one needn't be alarmed of Lucas' argument and simply explore the idea of emergence of consciousness. 

I need to get some sleep!

----

[^1]: I have detailed notes on _Gödel's Proof_ by Nagel and Newman [here](../../notes/godels-proof)

[^2]: J.R. Lucas, _Minds, Machines and Gödel_ 1961 [Archived](https://web.archive.org/web/20070819165214/http://users.ox.ac.uk/~jrlucas/Godel/mmg.html)

[^3]: In the program of formalization, reasoning is deferred to _meta-mathematics_. 

[^4]: It is essential to clearly differentiate between meta-mathematical reasoning (containing statements) and formulas within the formal system. The crux of Gödel's theorems lies in this separation. This separation originally followed from the program of formalization.

[^5]: Highly recommend Michael Levin's brilliant NeurIPS [talk](https://www.youtube.com/watch?v=RjD1aLm4Thg) on how computation and cognition can happen outside of the brain.