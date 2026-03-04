// reusable func for return new arr into the synonyms of modal
const createNewArr = (arr) => {
  const elements = arr.map(
    (el) => `<span class="btn bg-sky-100 rounded-md text-sm text-neutral"
                >${el}</span>`,
  );
  return elements.join(" ");
};

//loading spinner
const loadingSpinner = (status) => {
  if (status == true) {
    document.getElementById("loading-spinner").classList.remove("hidden");
    document.getElementById("lesson-card-container").classList.add("hidden");
  } else {
    document.getElementById("loading-spinner").classList.add("hidden");
    document.getElementById("lesson-card-container").classList.remove("hidden");
  }
};

//fetch the all levels api
const loadLesson = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((response) => response.json())
    .then((data) => displayLesson(data.data));
};

//load word details from api
const loadWord = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayLoadWord(details.data);
};

//display the load word with modal
const displayLoadWord = (word) => {
  const detailsContainer = document.getElementById("details-container");
  detailsContainer.innerHTML = `
            <div>
              <h2 class="text-3xl font-semibold text-neutral">
                ${word.word} (<i class="fa-solid fa-microphone-lines"></i> :${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"})
              </h2>
            </div>
            <div class="space-y-3">
              <p class="text-lg font-medium text-neutral">Meaning</p>
              <p class="text-lg font-medium text-neutral">${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"}</p>
            </div>
            <div class="space-y-3">
              <h4 class="text-lg font-semibold text-neutral">Example</h4>
              <p class="text-md text-neutral">
                ${word.sentence}
              </p>
            </div>
            <div>
              <h4 class="text-lg font-semibold text-neutral mb-5">
                সমার্থক শব্দ গুলো
              </h4>
             <div>${createNewArr(word.synonyms)}</div>
            </div>
            
  `;
  document.getElementById("word_modal").showModal();
};

// function for remove class
const removeClass = () => {
  const removeLessonBtnClassName = document.querySelectorAll(".lesson-btn");
  // console.log(removeLessonBtnClassName);
  removeLessonBtnClassName.forEach((btn) => {
    btn.classList.remove("active");
  });
};
// fetch the single level with api id
const levelWord = (id) => {
  loadingSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeClass();
      const activeBtn = document.getElementById(`lesson-btn-${id}`);
      activeBtn.classList.add("active");

      displayLevelWords(data.data);
    });
};

// display every single with button calls
const displayLevelWords = (words) => {
  //finding the lesson card container
  const lessonCardContainer = document.getElementById("lesson-card-container");
  lessonCardContainer.innerHTML = "";

  // handling a simple error
  if (words.length == 0) {
    lessonCardContainer.innerHTML = ` 
      <div class="col-span-full text-center space-y-6 p-10">
      <img class="mx-auto" src="./assets/alert-error.png"/>
          <p class="text-lg text-gray-500">
            এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
          </p>
          <h2 class="font-bangla text-5xl font-medium text-slate-800">
            নেক্সট Lesson এ যান
          </h2>
        </div>
    `;
    loadingSpinner(false);
    return;
  }

  // looping the every single word
  words.forEach((word) => {
    // create new element
    const lessonDiv = document.createElement("div");
    lessonDiv.className =
      "card text-center pt-10 pb-5 bg-white border border-gray-200";
    lessonDiv.innerHTML = `
          <div class="space-y-5">
            <h2 class="font-bold text-[32px] text-neutral">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
            <p class="text-[20px] font-medium text-neutral">
              Meaning / Pronunciation
            </p>
            <h2 class="font-bangla font-semibold text-[32px] text-neutral-600">
              ${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "Pronunciation পাওয়া যায়নি"}"
            </h2>
          </div>
          <div class="card-icons flex justify-between h-full items-end px-4 mt-5">
            <button onclick="loadWord(${word.id})" class="btn bg-sky-100 border-0 hover:bg-sky-500">
              <i  class="fa-solid fa-circle-info"></i>
            </button>

            <button class="btn bg-sky-100 border-0 hover:bg-sky-500">
              <i class="fa-solid fa-volume-high"></i>
            </button>
          </div>
      
    `;
    // append to the container
    lessonCardContainer.appendChild(lessonDiv);
  });
  loadingSpinner(false);
};

// display lesson btn
const displayLesson = (lessons) => {
  //1.find the necessary elements
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";
  //2. show the all lessons
  lessons.forEach((lesson) => {
    //3. create a div elements
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
             <button id="lesson-btn-${lesson.level_no}" onclick="levelWord('${lesson.level_no}')" class="btn border-primary btn-outline text-primary  lesson-btn">
            <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
          </button>
          `;

    //4.append to the main contain er
    levelContainer.appendChild(btnDiv);
  });
};

loadLesson();

// implementing searching functionality
document.getElementById("search-btn").addEventListener("click", () => {
  const input = document.getElementById("search-input");
  const searchValue = input.value.trim().toLowerCase();

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      removeClass();
      const allWords = data.data;
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue),
      );
      displayLevelWords(filterWords);
    });
});
