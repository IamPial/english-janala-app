const loadLesson = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((response) => response.json())
    .then((data) => displayLesson(data.data));
};

const displayLesson = (lessons) => {
  //1.find the necessary elements
  const levelContainer = document.getElementById("level-container");
  //2. show the all lessons
  lessons.forEach((lesson) => {
    //3. create a div elements
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
             <button class="btn btn-primary btn-outline">
            <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
          </button>
          `;

    //4.append to the main contain er
    levelContainer.appendChild(btnDiv);
  });
};

loadLesson();
