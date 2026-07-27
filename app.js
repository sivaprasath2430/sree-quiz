/* ======================================
   QUIZMASTER AI
   app.js
====================================== */

/* ========= Smooth Scrolling ========= */

document.querySelectorAll('a[href^="#"]').forEach(link=>{

    link.addEventListener("click",function(e){

        e.preventDefault();

        const target=document.querySelector(this.getAttribute("href"));

        if(target){

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});

/* ========= Navbar Scroll Effect ========= */

const header=document.querySelector("header");

window.addEventListener("scroll",()=>{

    if(window.scrollY>100){

        header.style.background="rgba(10,15,40,.95)";
        header.style.boxShadow="0 10px 30px rgba(0,0,0,.4)";

    }

    else{

        header.style.background="rgba(0,0,0,.25)";
        header.style.boxShadow="none";

    }

});

/* ========= Animated Counter ========= */

const counters=document.querySelectorAll(".stat h1");

let started=false;

window.addEventListener("scroll",()=>{

    const section=document.querySelector(".stats");

    if(!section) return;

    if(window.scrollY>section.offsetTop-500 && !started){

        counters.forEach(counter=>{

            animate(counter);

        });

        started=true;

    }

});

function animate(counter){

    const text=counter.innerText;

    const target=parseInt(text);

    let count=0;

    const speed=Math.max(1,Math.floor(target/80));

    const interval=setInterval(()=>{

        count+=speed;

        if(count>=target){

            counter.innerText=text;

            clearInterval(interval);

        }else{

            counter.innerText=count+"+";

        }

    },20);

}

/* ========= Fade In Animation ========= */

const observer=new IntersectionObserver(entries=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{threshold:.2});

document.querySelectorAll(".card,.category,.stat,.about,.cta").forEach(el=>{

    el.classList.add("hidden");

    observer.observe(el);

});

/* ========= Floating Background ========= */

setInterval(()=>{

    const bubble=document.createElement("span");

    bubble.className="bubble";

    bubble.style.left=Math.random()*100+"vw";

    bubble.style.width=Math.random()*30+10+"px";

    bubble.style.height=bubble.style.width;

    bubble.style.animationDuration=Math.random()*10+10+"s";

    document.body.appendChild(bubble);

    setTimeout(()=>{

        bubble.remove();

    },20000);

},800);

/* ========= Typing Effect ========= */

const title=document.querySelector(".hero-left h1");

if(title){

const original=title.innerHTML;

title.innerHTML="";

let i=0;

const typing=setInterval(()=>{

    title.innerHTML=original.substring(0,i);

    i++;

    if(i>original.length){

        clearInterval(typing);

    }

},50);

}

/* ========= Ripple Button ========= */

document.querySelectorAll(".btn,.btn2").forEach(button=>{

button.addEventListener("click",function(e){

const circle=document.createElement("span");

circle.classList.add("ripple");

this.appendChild(circle);

const x=e.clientX-this.offsetLeft;

const y=e.clientY-this.offsetTop;

circle.style.left=x+"px";

circle.style.top=y+"px";

setTimeout(()=>{

circle.remove();

},700);

});

});

/* ========= Back To Top ========= */

const topBtn=document.createElement("button");

topBtn.innerHTML="↑";

topBtn.className="topButton";

document.body.appendChild(topBtn);

window.addEventListener("scroll",()=>{

if(window.scrollY>500){

topBtn.style.display="block";

}else{

topBtn.style.display="none";

}

});

topBtn.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};

/* ========= Welcome ========= */

console.log("Welcome to QuizMaster AI");