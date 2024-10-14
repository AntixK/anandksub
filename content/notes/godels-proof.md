@def title = "Gödel's Proof - Ernest Nagel & James Newman"
@def published = "28 July 2021"
@def tags = ["math", "philosophy", "self-referential"]
@def is_draft = false
@def show_info = true
@def has_code = false
@def has_chart = false
@def has_math = true

&emsp; In this book, Nagel and Newman labours to explain the famous incompleteness theorems of Kurt Gödel and their mathematical and philosophical implications. They elaborate  the list of developments leading up to _Principia Mathematica_, which formed the colossal sculpture that Gödel destroyed.

### Axiomatic systems and their consistency

&emsp; The earliest framework for a mathematical _proof_, in contrast to experimental science, is that of the _axiomatic method_ where a proposition is logically deduced based on a set of commonly accepted statements (axioms / postulates). The Greeks developed geometry based on this system - recall Euclid's _Elements_.

The axiomatic method gained popularity as the axioms were reduced to a set of "undeniable truths" about our world, and the logical deduction guaranteed truth and mutual consistency of all the derived propositions or theorems. Gradually, the axiomatic method began to consume all of the standard scientific method. Increasing amount of effort was spent on developing adequate sets of axioms to incorporate physics, and new and old subfields within mathematics to formulate a sound axiomatic basis.

:::multilinequote
A climate of option was thus generated in which it was tacitly assumed ths each sector of mathematical thought can be supplied with a set of axioms sufficient for developing systematically the endless totality of true propositions about the given area of inquiry.
:::

Gradually, the proper business of mathematics became to derive propositions from a given set of axioms and their fundamental truth or validity became irrelevant. Imagine a world where a given set of axioms were true and mathematicians were involved in completing that world - trying to deduce every things that can logically happen in that world. We we live in flat world, Euclid's axioms are valid and all its deducible propositions are true. If we live in a non-flat world or a curved space, then a different set of axioms are valid and again, its deducible propositions are true. Therefore, postulates lost any special meaning or even a necessity that they must reflect the self-evident basics of our reality.

The first major breakthrough came with the works of Gauss, Bolyai, Lobachevsky, and Riemann, when they proved impossibility of deducing or proving a proposition within a axiomatic system. This form of a looping structure - a proof that talks about proving other theorems - was quite new and shed new light on the logical deduction mechanism of mathematics itself. They did not say that certain statements are false under a given axiomatic system, rather they cannot be proven within that system. More importantly, this also meant that theorems are nor absolutely true, rather hinge upon meanings assigned to them by their axiomatic gods.

:::multilinequote
This is the point of Russel's famous epigram: pure mathematics is the subject in which we do not know what we are talking about, or whether what we are saying is true.
:::

This conversion of mathematics to a high degree of abstraction - audaciously called _formalization_ - gave much freedom to explore new vistas and emphasized less on intuition. Intuitions can always be discovered or get accustomed to later, they said. Formalization abstracted away so much that aspects of axiomatic systems that were taken for granted were beginning to be questioned. The point in case - _consistency_.

When the axioms have been stripped of any connection to reality, do we have any guarantee that the propositions, though derived logically, cannot contradict each other? For more than a thousand years, Euclidean geometry was confidently presumed to be consistent based on the fact that its axioms were founded on reality as perceived by us [^1]. Now newer, more abstract, geometries were invented whose axioms lost connections to reality. Can these systems be consistent?

The first simple method was to _convert_ propositions of these abstract axiomatic systems into theorems of Euclid. Thus, they hinged on the confident presumption that Euclidean geometry was consistent. This solution simply transferred the problem of consistency to Euclidean geometry. Now the earlier presumption about its consistency came in serious concern.

Hilbert's conversion of geometry into algebra, based on the work of Descartes, transferred the consistency problem to algebra. Now, algebra at this point (19th century) was founded on the axioms of set theory. Georg Cantor and Bertrand Russel, much to their frustration, had then discovered perfectly logical contradictions within set theory. So, the entire foundation of mathematics was put to scrutiny. Most fields of mathematics relied on algebra, whose foundation was now shaky owing to these contradictions. The remaining fields too had to tackle the problem of consistency.

### Hilbert's Formalization Program

&emsp; Hilbert started his _formalization_ program to address the problem of consistency. The formalization program essentially stripped mathematics of any meaning and adhered to a complete abstraction of a set of symbols and rules and operations. Hilbert _mechanized_ mathematics. Theorems and postulates are mere strings of some symbols and are combined according to standardized rules. He tried to distinguish such mechanical manipulation of symbols from statements relating to intuition and understanding as _meta-mathematics_ *i.e.* statements about mathematics rather than mathematics itself.

<!-- He tried to resolve the paradoxes posed by Bertrand Russel as _meta-mathematics_ *i.e.* statements about mathematics rather than mathematics itself.  -->

With this naked view of mathematics, hilbert began to pose challenges of coming up with _absolute_ proofs of consistency that deals only with strings of symbols and well-defined rules. He also realized the risk of dealing with infinities as done by Georg Cantor and strictly prohibited proofs from making reference to "infinite structural properties of formulas or to an infinite number of operations with formulas".
An absolute proof of consistency should have finite steps, finite number of operations. Such proofs are meta-mathematical in nature. Hilbert separated solely to avoid intuition and preconceptions from muddying the waters of pure mathematics. Meta-mathematical statements can only be made based on the set of operations and rules *i.e* they ought to be inferred. Hilbert termed them as a _theory of proof_. Meta-mathematics is the analysis of mathematics itself - proving propositions from postulates. He conjectured that using only finite steps of analysis, one can be able to prove whether a given axiomatic system is consistent.

Bertrand Russell and Whitehead took up the challenge of formalizing mathematics as posed by Hilbert. They identified formal logic as the most fundamental of all mathematics and began to formalize it in an attempt to prove its consistency. After Hilbert, algebra itself was converted to arithmetic, whose axioms were shown to be deducible from a small number of basic propositions as logical truths. Therefore, Russel and Whitehead decided to tackle formal logic and build up foundations of mathematics, while pursuing its absolute proof of consistency in their famous _Principia Mathematica_.

### *Principia Mathematica* & Absolute Consistency

:::multilinequote
_Principia_, in sum, created the essential instrument for investigating the entire system of arithmetic as an uninterrupted calculus - that is, a a system of meaningless marks, whose formulas (or "strings") are combined and transformed in accordance with stated rules of operation.
:::

&emsp; In _Principia_, a set of symbols consisting of variables and operators (logical connectives like $\neg, \land, \vee, \to$) along with their formation rules were specified. Any string formed in accordance with the formation rules using those symbols is considered a valid formula. Furthermore as a point of illustration, lets consider two main transformation rules - the _Rule of Substitution_ where a formula (String) can be substituted in place of a variable, and the _Rule of Detachment_ (_modus ponens_) where if a formula $S_1$ is derivable, and if $S_1$ is true then $S_2$ is also true (represented as $S_1 \to S_2$), then $S_2$ is also derivable. Certain finite set of formulas can be considered to be primitive and be assigned as axioms. Thus, any meaning associated with any of the symbols, operations or axioms are stripped clean [^2].

Based on this framework, the method for the absolute proof of consistency is to find out what constitutes as _absolute consistency_ within the given framework and then employ meta-mathematical reasoning to show that a property of the axioms (a statement about the axioms) exists such that the abstract notion of absolute consistency is satisfied.

With the axioms framed by the _Principia_ and two rules stated, for absolute consistency, it can be shown that if every manipulated formula $q$ is provable using the axioms and other theorems, then there must be at least one theorem $S$ whose contradiction $\neg S$ must also be provable[^3]. As for the meta-mathematical reasoning, we take the property of "being true" or a _tautology_. The task is to show that at least a formula $q$ exists such that it is not a tautology and thus, it cannot be proven. Through this reasoning,  it can be showed this small framework is absolutely consistent.

A converse of the above idea is "whether every tautology can be proved?" *i.e.* can every logically true statement can be derived using the axioms? If yes, then the system is _complete_. A remarkable thing about this converse is that it separates tautology from provability. Till now, we had assumed provability as the definition of tautology. _Principia_, which defined the framework for the whole of arithmetic, could not be proved to absolutely consistent - even after many attempts. Gödel was to make things only much  worse.

### Gödel's Theorems

&emsp; Gödel extended many of the ideas the presented in the _Principia_. The first is the idea of representing propositions and formulas as mere strings. Since they are strings, they can be encoded, mapped to other strings, counted and so on. The second idea that he majorly extended, that had dire consequences, is the ida of _mapping_.

Hilbert and his contemporaries had essentially mapped geometry and algebra to arithmetic in search for the consistency of the axiomatic system. The _Principia_ had then mapped arithmetic to logic. Gödel identified that mapping inherently transfers the problem from one domain to another unabating the fundamental issue. But could there be any field more fundamental than logic? The meta-mathematical arguments themselves require logical reasoning. So, what if we can map the meta-mathematical statements about a sufficiently formal system (a system that is sufficient to characterize arithmetic and hence, all of geometry and algebra)  back to the system itself? This need not necessarily be logic (Frege-Russel thesis) or set theory (ZFC axioms), but sufficient formal system. This _self-referential_ mapping is the crux of Gödel's theorems [^4].

Gödel's focus was on studying the absolute consistency and completeness of any formal system powerful enough to characterize arithmetic. Absolute consistency can be proved for smaller systems as shown before.

Gödel constructed a formal system for arithmetic and a mapping strategy where each symbol, variable, and formula were assigned unique numbers. This is called as the _Gödel numbering_. For instance, each of the symbols were assigned numbers from 1; then variables and predicates were assigned prime numbers and their powers. Based on this, the formulas were assigned unique numbers by raising consecutive prime numbers to the value indicated by that symbol and then multiplying them for form a new unique number specific to that formula[^5].For example, consider the formula

$$
(\exists x)(x = sy)
$$
Which says there exists a numerical variable $x$ that is a successor to another numerical variable $y$. The numbers for these symbols (as they are merely strings) are $8, 4, 11, 9, 8, 11,5,7,13, 9$. The Gödel number for the above formula is

$$
2^{8} \x 3^{4} \x 5^{11} \x 7^{9} \x 11^{8} \x 13^{11} \x 17^{5} \x 19^{7} \x 23^{13} \x 29^{9}
$$

Similarly, a sequence of formulas with corresponding Gödel numbers $n_1, n_2, ... n_m$ can be combined to give a single godel number as $p_1^{n_1} \x p_2^{n_2} \x ... \x p_m^{n_m}$ where $p_i$ is the $i^{th}$ prime number.

This _arithmetization_ of formal calculus also yields the ability to verify whether a given number is a Gödel number *i.e.* a valid formula within the formal calculus. This can be done through prime factorization where a given number can be checked if it is composed of powers of successive primes or simply just the symbol numbers.

Any meta-mathematical statement about the expressions in the formal calculus can be considered as a statement about their Gödel numbers and their arithmetic relations. Recall that the formal system of arithmetic is essentially describing the same. Therefore,  all of the meta-mathematical statements is can be adequately mapped back to the calculus itself.

It is not difficult to anticipate Gödel's next set of arguments.
1) An arithmetic formula $G$ can be constructed that represents the meta-mathematical statement that "The formula G is not demonstrable" *i.e.* provable. This can be done in a way such as a Gödel number $h$ represents "the formula associated with $h$ is not demonstrable".
2) This, by definition, leads to a contradiction that $G$ is demonstrable if, and only if, $\neg G$ is demonstrable. This means that arithmetic is inconsistent.
3) However, Gödel did not stop there. He proceeded to show that $G$ is not only undecidable, it is also _true_. The meta-mathematical statement "G is not demonstrable" is indeed true since both $G$ and $\neg G$ are demonstrable. Thus, the system is _incomplete_. In other words, we cannot deduce all arithmetic truths from the given set of axioms. Even if a system is augmented with additional axioms, other true but undecidable arithmetic statements will still exist.
4) Lastly, "the coda of Gödel's amazing intellectual symphony", he constructed the statement $A$ that represents "Arithmetic is consistent" and showed that it is not demonstrable. Therefore, any and every formal system characterizing arithmetic is always inconsistent and incomplete. A true statement but undecidable statement is one that can be arrived at only using meta-mathematical statements and not by deducing formally from the axioms. The true statement exists external to the formal axiomatic space and hence, is undecidable.

### Caveats & Takeaways
- Gödel's theorems do not say that no _finitistic absolute proof of consistency_ can be constructed for a given formal system. In fact it can be done as shown previously. For a simple enough system, its consistency can be proved.
- Gödel's showed that no _finitistic absolute proof of consistency_ can be constructed _within_ arithmetic. However, it does not exclude the possibility of constructing a finitistic absolute proof of consistency _for_ arithmetic using another axiomatic system. This means an axiomatic system may exist in which a finitistic proof of consistency of arithmetic can be constructed provided, the proof is *not* capable of formulation within arithmetic [^6].
- They show that there is an endless number of true arithmetic statements which cannot be formally deduced from any given set of axioms by a closed set of inference rules. This is an inherent inability of the axiomatic system pertaining to the arithmetic field (and by extension algebra, geometry and etc.).
:::multilinequote
..what we understand by the process of mathematical proof does not coincide with the exploitation of a formalized axiomatic method.
:::
    Even within a more sophisticated formal system where the consistency of arithmetic can be proved, there must be infinite number of true statements which cannot be proved within that system. In short, no axiomatic system can be both consistent and complete. Any consistent axiomatic system is incomplete. This is Gödel's first incompleteness theorem.

- Based on the self-referential statement, No consistent system can prove its own consistency. Proving a system's consistency lies outside of its axiomatic system and can only be proved using meta-mathematical reasoning. This is Gödel's second incompleteness theorem.
- There is a lot of confusion between what is a _true_ statement and a _demonstrable_(provable) statement. It is understandable to think that they are equivalent. From Gödel's theorems, they are clearly distinct. All demonstrable statements are indeed true, but all true statements are not necessarily demonstrable within a formal system. Provability/ demonstrability is the property of the formal system, while truth is outcome of meta-mathematical reasoning. A true but unprovable statement is one which has rigorous meta-mathematical reasoning, while being total un-representable within the formal system.

These undecidability theorems employing self-referentials would again come back to haunt a different but related field - Computer Science. This would have deeper and immediately recognizable repercussions on computation and even the extent of our cognitive abilities.

----

[^1]: Euclid's parallel line axiom was widely questioned, as the ancients did know of asymptotes - curves that meet only at infinity - while parallel lines are those that do not meet even at infinity. So, this wasn't quite obvious to assume as an axiom. This lead to interesting developments like the curved space of Riemannian geometry.

[^2]: This is essentially a subset of the framework described in the _Principia_.

[^3]: Assume $S$ and $\neg S$ are provable. Based on the theorem $p \to (\neg p \to q)$, we can replace $p$ by the formula $S$ (Rule of substitution) as $S \to (\neg S \to q)$ and from the rule of detachment, we get $\neg S \to q$. Since $\neg S$ is provable then, again by rule of detachment, the (any) formula $q$ can be proven. Therefore, there must be at least one formula $q$ that is not derivable by the axioms.

[^4]: The inspiration for the self-referential may have come from Russel's paradox or similar such paradoxes that existed.

[^5]: This is based on the prime factorization theorem.

[^6]: Gerhard Gentzen presented a proof of consistency for arithmetic but it cannot be mapped into the formalism of arithmetic and does not constitute as finitistic (as it used the _principle of transfinite induction_).

----

All the above excerpts are attributed to their original author(s). Book info -


> Ernest Nagel; James Newman, *Gödel's Proof*, 2008. Little, NYU Press. ISBN-13: 9780814758373 ISBN-10: 0814758371
