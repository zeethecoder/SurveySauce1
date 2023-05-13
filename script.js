const textareaEl = document.querySelector('.form__textarea');
// const charactersleftEl = document.querySelector('.current-left');
const formEl = document.querySelector('.form');
const feedbackList = document.querySelector('.feedbacks');
const submitBtnel = document.querySelector('.submit-btn__text');
const counterEl = document.querySelector('#current-left');
const spinnerEl = document.querySelector('.spinner');
const hashtagList = document.querySelector('.hashtags');
const hashtagButtons = document.querySelectorAll('hashtag');
const max_CHARACTERS = 150;
const renderfeedbackHTML = (eachItem) => {
    const hashtagHTML = `
    <li class="feedback">
    <button class="upvote">
        <i class="fa-solid fa-caret-up upvote__icon"></i>
        <span class="upvote__count">${eachItem.upvoteCount}</span>
    </button>
    <section class="feedback__badge">
        <p class="feedback__letter">${eachItem.badgeLetter}</p>
    </section>
    <div class="feedback__content">
        <p class="feedback__company">${eachItem.company}</p>
        <p class="feedback__text">${eachItem.text}</p>
    </div>
    <p class="feedback__date">${eachItem.daysAgo === 0 ? 'NEW' : `${eachItem.daysAgo}d`}</p>
    </li>
    `
    // insert hashtaghtml element

    feedbackList.insertAdjacentHTML('beforeend', hashtagHTML);
};


// global variables 


const textInputEvent = () => {

    // Word Counter function

    // max numbers - numbers typed = numbers left

    const maxNumberwords = max_CHARACTERS;

    const numbersTyped = textareaEl.value.length;

    const numbersLeft = maxNumberwords - numbersTyped;

    counterEl.textContent = numbersLeft;

}

textareaEl.addEventListener('input', textInputEvent);

// input typing event end


// sdsdsd




// submit form 

const formFunction = (event) => {
    event.preventDefault();
    const text = textareaEl.value;

    // validation form on event being fired
    if (text.includes('#') && text.length >= 5) {
        formEl.classList.add('form--valid');
        setInterval(() => {
            formEl.classList.remove('form--valid');
        }, 2000);
    } else {
        formEl.classList.add('form--invalid');

        setInterval(() => {
            formEl.classList.remove('form--invalid');
        }, 2000);

        textareaEl.focus();

        return;
    }


    // grab sumbittted data and paste it into list of feedbacks 

    const hashtag = text.split(' ').find((symbol => symbol.includes('#')));

    const company = hashtag.substring(1);
    // grab letter
    const badgeLetter = company.substring(0, 1).toUpperCase();
    const upvoteCount = 0;
    const daysCount = 0;
    const daysAgo = 0;

    const eachItem = {
        company: company,
        badgeLetter: badgeLetter,
        upvoteCount: upvoteCount,
        daysCount: daysCount,
        daysAgo: daysAgo,
        text: text
    }
    // call function to create list for ordered list on submisson
    renderfeedbackHTML(eachItem);

    // POST DATA TO THE API database 

    fetch('https://bytegrad.com/course-assets/js/1/api/feedbacks', {
        method: 'POST',
        // converting submitted data to json to string form
        body: JSON.stringify(eachItem),
        headers: {
            Accept: 'applications/json',
            'Content-type': 'application/json',
        }

    }).then(response => {
        if (!response.ok) {
            console.log('FAILED TO POST');
            return;
        }
        console.log('Successfully Submitted')
    }).catch(error => {
        console.log(error);
    });



    // on submit clear text area
    textareaEl.value = " ";

    // submit button being on point 
    submitBtnel.blur();


    // reset text to 150 characters after submitting hashtag

    counterEl.textContent = max_CHARACTERS;



};


formEl.addEventListener('submit', formFunction);







//Upvote feature Using Events 

const upVoteClick = (event) => {
    const clickedEl = event.target;

    const upvoteIntention = clickedEl.className.includes('upvote');

    console.log(upvoteIntention);

    if (upvoteIntention) {
        const upvoteBtnEl = clickedEl.closest('.upvote');

        upvoteBtnEl.disabled = true;

        const upvoteCountEl = upvoteBtnEl.querySelector('.upvote__count');

        // converting string to number +
        let upvoteCount = +upvoteCountEl.textContent;

        // increment by one 
        upvoteCount = upvoteCount + 1;

        // set upvote count
        upvoteCountEl.textContent = upvoteCount;



    } else {
        clickedEl.closest('.feedback').classList.toggle('feedback--expand');
    }

};

feedbackList.addEventListener('click', upVoteClick);






// getting and posting feedback to componet

fetch('https://bytegrad.com/course-assets/js/1/api/feedbacks')
    // converting to json
    .then(response => response.json())
    .then(data => {

        // remove spinner on fetching
        spinnerEl.remove();

        data.feedbacks.forEach(eachItem => {
            renderfeedbackHTML(eachItem)
        });
    })
    .catch(error => {
        feedbackList.textContent = `Failed to load data: ${error.message}`;
        // customize error with html css connected element stored in js varible 
    });

    hashtagEvent = (event) => {
        const clickedHashtag = event.target;

        if (clickedHashtag.className.includes('hashtags')) return;

        const companyNameFromHastag = clickedHashtag.textContent.substring(1).toLowerCase().trim();

        feedbackList.childNodes.forEach(childNode => {


            if(childNode.nodeType === 3) return;

            const companyNameFromFeedbackItem = childNode.querySelector('.feedback__company').textContent.toLowerCase().trim();

            if(companyNameFromHastag !== companyNameFromFeedbackItem) {
                childNode.remove();
            }else{
                clickedHashtag
            }
        });
        
        
    }

    
    hashtagList.addEventListener('click', hashtagEvent);