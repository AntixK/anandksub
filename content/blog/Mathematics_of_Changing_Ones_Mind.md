@def title = "Mathematics of Changing One's Mind"
@def published = "4 August 2023"
@def description = "A guide to updating probabilistic beliefs using Jeffrey's rule and Pearl's method."
@def tags = ["math", "ml", "probability"]
@def has_math = true
@def is_draft = false
@def has_chart = true

<!-- TODO
- [ ] Interactive demo
- [ ] Relation with Bayes' factor
- [ ] Jeffry;s rule is indeed bayesian
- [ ] 3b1b's question analysis? -->

&emsp; Bayes' rule, despite its far-reaching influence, has a fundamental problem. Say we have an initial belief about some event $A$. This belief can be represented as a probability that *we* have about that event. This is called the *prior* probability $p(A)$. Now, we observe another $E$, whose probability of occurring is $p(E)$. If the two events are unrelated, *i.e.* independent, then there is no need to *update* our belief regarding the event $A$. However, if they are related, in any way, then the Bayes' rule provides a general to update our belief about $A$.

$$
p(A|E) = \frac{p(A, E)}{p(E)} = \frac{p(E|A)p(A)}{p(E)} = \frac{\text{Likelihood} \times \text{Prior}}{\text{Evidence}}
$$


The resulting update to our prior belief is called as the *posterior*, represented by $p(A|E)$. The relation between the two events $E$ and $A$ is represented by $p(E|A)$, called the *likelihood*.
Note that the above rule combines our initial belief $p(A)$, which may or may not be supported by hard evidence, with the hard evidence $p(E)$. Now, what if we have some uncertainty about the occurrence of $E$, say that we are only 70% sure that $E$ has occurred?. This is called the _soft evidence problem_. The Bayes' rule is straightforward to apply in the light of hard evidence, but not so much for soft evidence. This point is oft missed when learning about Bayes' rule. The problem is still under scrutiny as we still do not have one standard way to interpret and reason with soft evidence.

&emsp; We shall discuss two common ways of dealing with such uncertainty in our evidence. It is worth noting that $p(E)$ is not the same as the uncertainty in the *occurrence* of $E$. $p(E)$ is the probability that $E$ can occur indisputably among all other events, while the uncertainty lies in *our* observation that $E$ has indeed occurred. The title has been borrowed from a paper by Bart Jacobs[^1], who in turn borrowed it from a 1983 paper by Diaconis & Zabell[^2]. 

&emsp; The two common ways of dealing with such uncertainties are **Jeffrey's rule** (due to Richard Jeffrey and not the better-known Harold Jeffrys) and **Pearl's method of virtual evidence** (due to Judea Pearl). The point is to understand the perspectives from which these two methods come and the way they ought to be employed based on those perspectives.

Before discussing the two belief updates, let's extend the above Bayes' rule to a set of possible states or events $\fE = \{e_1, e_2, ... e_k\}$ and $\fA = \{a_1, a_2,...a_n\}$. This set can be discrete, as shown, or continuous, but the following discussion applies to both. The Bayes' rule states that

$$ \label{eq:bayes}
\begin{aligned}
p(\fA = a_i|\fE = e_j) = p(a_i|e_j) &=  \frac{p(\fE = e_j|\fA= a_i)p(\fA=a_i)}{p(\fE = e_j)} \\
&= \frac{p(e_j|a_i)p(a_i)}{\sum_{i=1}^np(e_j|a_i)p(a_i)}
\end{aligned}
$$

Now, the soft evidence problem can be understood as the way of updating the above posterior $p(a_i|e_j)$ when $p(e_j)$ is uncertain. Depending on the way the uncertainty is injected into the above equation, the update method changes correspondingly.

### Jeffrey's Rule
Say we have another belief $q(e_j)$ over $p(e_j)$ which specifies the degree of uncertainty in the occurrence of the event $e_j$. Then, Jeffrey's rule states that the *posterior* should be updated as 

$$ \label{eq:jeffrys}
\begin{aligned} 
p_{\text{JR}}(a_i | q_j) &= \sum_{j=1}^k p(a_i|e_j) q(e_j) && {\color{OrangeRed} \text{(Jeffrey's Rule})}\\
&= \sum_{j=1}^k \frac{p(e_j|a_i)p(a_i)}{p(e_j)} q(e_j) \\
&= \sum_{j=1}^k \frac{q(e_j)}{p(e_j)} p(a_i, e_j), \quad \forall e_j \in \fE \\
\end{aligned}
$$

The following can be observed from the above equation -
- Jeffrey's rule considers the uncertainty $q(e_j)$ as a distribution over that event unrelated to the evidence $p(e_j)$.
- Jeffrey's rule operates directly on the posterior. Therefore, it assumes that the belief $q(e_j)$ is obtained _after_ the posterior has been calculated. In other words, the posterior is marginalized over the uncertainty distribution. This can be interpreted as the _surprise factor_ in updating our beliefs. The $q(e_j)$ can be interpreted as the effect on both the evidence strength and the likelihood belief.
- In the new posterior $p(a_i | q)$, the additional information from $q(e_j)$ is directly reflected in the posterior in a _linear_ fashion (as marginalization is a linear operation). 

### Pearl's Method 
Pearl's method considers the uncertain information as a conditional belief over the initial evidence $p(e_j)$,  *i.e.* $p(e_j | q_j)$. So, the initial posterior must be *marginalized* over this conditional distribution. In other words, the posterior must be corrected such that the initial evidence was infact conditional upon the certainty of that evidence.

The new posterior, according to Pearl, is given by

$$\label{eq:pearl}
\begin{aligned} 
p_{\text{PM}}(a_i | q_j) &= \sum_{j=1}^k p(a_i|e_j) p(e_j | q_j) && {\color{OrangeRed} \text{(Pearl's Method})}\\
&= \sum_{j=1}^k \frac{p(a_i|e_j) p(q_j | e_j)p(e_j)}{p(q_j)} \\
&= \sum_{j=1}^k \frac{ p(q_j | e_j)}{p(q_j)}p(a_i, e_j), \quad \forall e_j \in \fE \\
\end{aligned}
$$

- Pearl's method recasts the soft evidence (uncertainty over the evidence) as a new evidence (virtual evidence) that is conditioned upon the uncertainty. There is no "surprise element" to the uncertainty.
- In case of multiple uncertain evidence $q_j, r_j, ...$, Pearl's method produces the same final result irrespective of their order of updates to the posterior, while Jeffrey's rule does not. In other words, Pearl's method is linear across virtual events. This is a crucial difference between the two, that affects the applicability of the two methods. 

### Comparing Jeffrey's Rule and Pearl's Method
&emsp; Patently the two methods give very different results in general as the final belief update, although they both marginalize the posterior. According to Jeffrey's rule, the uncertainty originates from our observation of the event. Pearl's method states that, in the light (gloom?) of uncertainty, you have to consider not the original event, but a similar event that is uncertain by nature. However, both the methods for updating the posterior are valid within the Bayesian framework - in fact, both are seen as a generalization of the Bayes' rule. Jacobs notes, 

> Jeffrey's rule is for _correction_ while Pearl's rule is for _improvement_.

Pearl's method can be thought as a two-step procedure where the Bayes rule is applied twice. First in computing the initial posterior $p(a|e)$ and then computing the virtual evidence $p(e|q)$. Whereas in Jeffrey's rule, Bayes' rule is applied just once.

!!!
<img src="/media/post_images/jeff-pearl.svg" alt="Comparison between Pearl and Jeffrey's rules">
!!!

When we have multiple evidence, Pearl's method considers uncertainties associated with each evidence. Once the uncertainty is accounted for *i.e.* $p(e|q)$ is computed, the order of computation does not affect the posterior. On the other hand, Jeffrey's rule considered the uncertainty to be exterior to the evidence - therefore, in the case of multiple evidence, the order of application matters. 

Now, let's take a look at how we can understand uncertainty. 
- **Case 1:** [^1] Say, a medical test (a very typical example for this topic) for a disease has a *sensitivity* of 90% *i.e.* if a person has the disease, then the test detects it 90% of the time. On the other hand, the *specificity* is 95% *i.e.* if the person does *not* have the disease, the test returns negative 95% of the time. If a person takes the test consecutively 3 times and observes two positives and a negative. Now, what is the probability that the person has the disease given that he is 95% sure that he doesn't have it?
- **Case 2:**[^c2] Kotaro (Japanese) has a job interview with Terence (Irish). He is confident that he is well-equipped for the role and will get selected. A Few days later, Kotaro receives a phone call from Terence. Kotaro gets the impression that he is selected for the job but could not make out entirely due to Terence's thick Irish accent. How should Kotaro update his initial belief about his selection?

The two examples, obviously tailored to suit Pearl and Jeffrey's notions respectively, illustrate the different ways one can come across uncertainty. In case 1, it seems more appropriate to view the event as not the result of the medical test but as a new (virtual) event where the test has the stated specificity and sensitivity but also *precision*. So, the posterior should be calculated for this imprecise medical test. 
In case 2, it is the poor communication that happens between two people with different English accents, that causes the uncertainty. Thus, Jeffrey's rule may seem more appropriate. 

!!!
<div >
    <canvas class="chart" id="PM-JR-Chart"></canvas>
</div>
<div class="slider-container">
<label for="sen">Sensitivity:</label>
<input oninput="updateSen(this.value)" type="range", id="sen", min="0.1", max="0.99" value="0.9" step="0.01"/>

<br>

<label for="spec">Specificity</label>
<input oninput="updateSpec(this.value)" type="range", id="spec", min="0.1", max="0.99" value="0.95" step="0.01"/>

<br>


<label for="prior">Disease Prevalence:</label>
<input oninput="updatePrior(this.value)" type="range", id="prior", min="0.01", max="0.2" value="0.05" step="0.01"/>
</div>

<script>

    function bayes(prior, likelihood, evidence) {
        return prior * likelihood / evidence;
    }

    function pearl(prior, likelihood, evidence, uncertainty){
        // p(Test is Positive | Test is Certain) p(T|C)
        let p_t_c = uncertainty * evidence / (uncertainty * evidence + (1-uncertainty)*(1-evidence));

        // P(D|T) = P(T|D)P(D) / P(T)
        let res_pos = bayes(prior, likelihood, evidence)

        // P(D|T') = P(T'|D)P(D) / P(T')
        let res_neg = bayes(prior, (1-likelihood), (1-evidence))

        // P(T'|C) = 1-p(T|C)
        let pearl_res = res_pos * p_t_c + res_neg * (1-p_t_c)

        return pearl_res
    }

    function jeffrey(prior, likelihood, evidence, uncertainty){
        let res_pos = bayes(prior, likelihood, evidence);

        let res_neg = bayes(prior, (1-likelihood), (1-evidence))

        let jeff_res = res_pos * uncertainty + res_neg * (1 - uncertainty);
        return jeff_res;
    }

    let sen = 0.9;
    let spec = 0.95; 
    let prior = 0.05; 
    let uncerts = [0.        , 0.11111111, 0.22222222, 0.33333333, 0.44444444,
        0.55555556, 0.66666667, 0.77777778, 0.88888889, 1.        ];


    function compute_results(spec, sen, prior){
        var pearl_res_ = [];
        var jeff_res_ = [];
        var init_belief = [];
        var bayes_ = [];

        let evidence = (sen * prior + (1-spec) * (1- prior));
        let r3 = bayes(prior, sen, evidence);    

        for(i in uncerts){
            let r1 = jeffrey(prior, sen, evidence, uncerts[i]);
            let r2 = pearl(prior, sen, evidence, uncerts[i]);

            pearl_res_.push(r2);
            jeff_res_.push(r1);
            init_belief.push(prior);
            bayes_.push(r3);

        }

        return {
            "pearl_res":pearl_res_,
            "jeff_res":jeff_res_,
            "init_belief":init_belief,
            "bayes_res":bayes_,
        };
    }
    var results = compute_results(spec, sen, prior);

    function get_data(results){
        data = {
            labels: uncerts,
            datasets: [
                {
                    label: "Pearl's Result",
                    data: results["pearl_res"],
                    borderWidth: 2,
                    tension:0.3,
                    
                },
                {
                    label: "Jeffrey's Result",
                    data: results["jeff_res"],
                    borderWidth: 2,
                },
                {
                    label: 'Initial Belief',
                    data: results["init_belief"],
                    borderWidth: 2,
                },
                {
                    label: "Bayes' Result",
                    data: results["bayes_res"],
                    borderWidth: 2,
                },
                {
                    label: "Certainty",
                    data: uncerts,
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                },
            ]
        };
        return data;

    }
    function updateSen(value){
        
        sen = value;
        results = compute_results(spec, sen, prior);
        
        mychart.data =get_data(results);
        mychart.update("none");
        output.innerHTML = value;
    }

    function updateSpec(value){
        spec= value;
        results = compute_results(spec, sen, prior);
        
        mychart.data =get_data(results);
        mychart.update("none");
    }
    function updatePrior(value){
        prior = value;
        results = compute_results(spec, sen, prior);
        
        mychart.data =get_data(results);
        mychart.update("none");
    }

    const ctx = document.getElementById('PM-JR-Chart');
    var options = {
        maintainAspectRatio: false,
        devicePixelRatio: window.devicePixelRatio,
        responsive: true,
        layout: {
            padding:{
                left : 20,
                right: 10,
            }
        },
        scales: {
            x:{
                type: 'linear',
                min:0.0,
                max:1.0,
                title: {
                    display: true,
                    text: 'Certainty of a Positive Test Result',
                    font:{
                        size:15,
                    },
                }
            },
            y: {
                type: 'linear',
                min:0.0,
                max:1.0,
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Belief',
                    font:{
                        size:15,
                    },
                }
            },
        },
        plugins: {
            legend: {
                position: 'top',
                labels:{
                    font:{
                        size:15,
                    },
                },
            },
            title: {
                display: true,
                text: "Comparison Between Jeffrey's and Pearl's Rules (Case 1)",
                font:{
                    size:17,
                }
            },
            interaction: {
                mode: 'index',
            },
        },
    };

    <!-- Chart.defaults.font.size = 9; -->
    Chart.defaults.font.family = "Overpass";

    const mychart = new Chart(ctx, {
    type: 'line',
    data: get_data(results),
    options: options,
        
    });

</script>
!!!

&emsp; Consider the plot as shown above for the case 1. Play around with the sliders to see how the predictions of Pearl's and Jeffrey's rules change. Irrespective of the values, they both converge to the true Bayes's result for 100% certainty in the test. Moreover, they converge to the same value for 100% certainty of a negative test. As mentioned before, Jeffrey's rule scales linearly with the certainty of the test, while Pearl's method does not. As expected, as the test's certainty of producing a negative result increases, both results suggest that the probability of having the disease is less than the disease prevalence.

From the above plot, one can observe that Pearl's rule is more biased towards the prior (initial belief) than Jeffrey's, especially around the high-uncertainty region ($\sim$ 0.5). Pearl's method implies, that unless there is a high certainty of a positive test or a negative test, it is better to be biased towards the initial belief. 

Jeffrey's method is biased towards the uncertainty distribution (indicated by the dashed line, for reference) as shown in the above plot.  This has an interesting interpretation - Jeffrey's rule considered the uncertainty as a target distribution, rather than the evidence. How can the posterior be updated to suit the observation that repeated tests give two positives and a negative? As such Jeffry's rule minimizes this discrepancy between the result based on the original evidence and actual (uncertain) observations. In fact, this was mathematically proven by Jacobs and Stein[^4]. In this view, Pearl's method is *pessimistic* towards the uncertainties, while Jeffrey's is *optimistic*, but both align with each other in case of high certainties.


<!-- For no certainty in the result, Pearl's method may seem to smoothly converge to the prior belief about the disease prevalence, unlike Jeffrey's rule that linearly scales with the certainty. However, for low Sensitivities, (very inaccurate tests), Pearl's method also seem to update the belief -->

<!-- Then there is the question of *should uncertainties commute?* -->


<!-- The likelihood ratios shed light on the reconciliation between the two techniques - through _Bayes' factor_[^3]. -->

### Afterword
&emsp; Pearl's and Jeffrey's methods mirror the classic difference between lazy and eager techniques in statistical inference. Should you directly fit the mode of a distribution (like Maximum Likelihood Estimation (MLE), Variational inference (VI)) or should you be careful in modelling the entire data (like in Gaussian Process (GP), Belief Propagation (BP), or Expectation Propagation (EP))?[^5] While the former can be easy to compute and often works well enough in practice, the latter does have its use cases and and more rigour. There is no definitive answer to which technique is the "best". It comes down to how would you view the uncertainty. In fact Jacobs[^1] argues that both can be used in the same scenario as a linear combination - weighted by our confidence $\gamma$ on the uncertainty.
$$
\gamma \; p_{\text{JR}}(a_i |  q_j) + (1 - \gamma) \; p_{\text{PM}}(a_i |  q_j)
$$

Funnily, enough, the above equation follows Jeffrey's notion of uncertainty.

----

[^1]: Jacobs, B. (2019). The Mathematics of Changing one’s Mind, via Jeffrey’s or via Pearl’s update rule. Journal of Artificial Intelligence Research, 65, 783-806.


[^2]: Diaconis, P., & Zabell, S. (1983). Some alternatives to Bayes’ rule. Tech. rep. 339, Stanford Univ., Dept. of Statistics.

[^c2]: Example taken from - Halpern, J. (2003). Reasoning about Uncertainty. MIT Press, Cambridge, MA.

[^3]: This [video](https://www.youtube.com/watch?v=lG4VkPoG3ko) by 3Blue1Brown provides great introduction to Bayes factor. 

[^4]: Jacobs, B., & Stein, D. (2023). Pearl's and Jeffrey's Update as Modes of Learning in Probabilistic Programming. Electronic Notes in Theoretical Informatics and Computer Science.

[^5]: In fact, we can view that Pearl's method performs forward KL (via Belief Propagation), while Jeffrey's method performs reverse KL (Variational Inference) as shown by Jacobs and Stein.