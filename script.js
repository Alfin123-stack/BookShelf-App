document.addEventListener("DOMContentLoaded", function () {


    const submitForm = document.getElementById("form");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        submitForm.reset()
        addTodo();
    });


    const todos = [];
    const RENDER_EVENT = 'render-todo';

    function addTodo() {
        const tittleTodo = document.getElementById('judul').value;
        const authorTodo = document.getElementById('penulis').value;
        const yearTodo = document.getElementById('tahun').value;
        const selesaiTodo = document.getElementById('selesai').checked;

        
       
        const generatedID = generateId();
        const todoObject = generateTodoObject(generatedID, tittleTodo, authorTodo, Number(yearTodo), selesaiTodo);
        todos.push(todoObject);
        
       
        document.dispatchEvent(new Event(RENDER_EVENT));
        savedData();
    }


    function generateId() {
        return +new Date();
    }
       
    function generateTodoObject(id, tittle, author, year, isCompleted) {
        return {
          id,
          tittle,
          author,
          year,
          isCompleted
        }
    }

    function makeTodo(todoObject) {
        const textTitle = document.createElement('h2');
        textTitle.innerText = todoObject.tittle;
       
        const textAuthor = document.createElement('p');
        textAuthor.innerText = "Penulis : " + todoObject.author;
       
        const textYear = document.createElement('p');
        textYear.innerText = "Tahun : " + todoObject.year;
       
        const container = document.createElement('div');
        container.classList.add('pembungkus');
        container.append(textTitle, textAuthor , textYear);
        container.setAttribute('id', `todo-${todoObject.id}`);
       
        if (todoObject.isCompleted) {
            const undoButton = document.createElement('button');
            undoButton.classList.add('belum-btn');
         
            undoButton.addEventListener('click', function () {
              undoTaskFromCompleted(todoObject.id); 
            });
         
            const trashButton = document.createElement('button');
            trashButton.classList.add('hapus-btn');
         
            trashButton.addEventListener('click', function () {
                const popUp = document.querySelector(".pop-upCard");
              popUp.removeAttribute("hidden");

              const hapusButton = document.getElementById("yakin-btn");

              hapusButton.addEventListener("click", function () {
                removeTaskFromCompleted(todoObject.id);
                popUp.setAttribute("hidden", true);

                const succesPopup = document.getElementById("success-popup");

                succesPopup.removeAttribute("hidden");

                const tutupbtn = document.getElementById("close-btn");

                tutupbtn.addEventListener("click", function (){
                    succesPopup.setAttribute("hidden" , true);
                })

              });

              const tutupButton = document.getElementById("tutup-btn");

              tutupButton.addEventListener("click", function () {
                popUp.setAttribute("hidden", true);
              });
            });
         
            container.append(undoButton, trashButton);
        } 
        else 
        {
            const checkButton = document.createElement('button');
            checkButton.classList.add('sudah-btn');

            checkButton.addEventListener('click', function () {
                addTaskToCompleted(todoObject.id);
            });

            const trashButton = document.createElement('button');
            trashButton.classList.add('hapus-btn');
         
            trashButton.addEventListener('click', function () {

              const popUp = document.querySelector(".pop-upCard");
              popUp.removeAttribute("hidden");

              const hapusButton = document.getElementById("yakin-btn");

              hapusButton.addEventListener("click", function () {
                removeTaskFromCompleted(todoObject.id);
                popUp.setAttribute("hidden", true);

                const succesPopup = document.getElementById("success-popup");

                succesPopup.removeAttribute("hidden");

                const tutupbtn = document.getElementById("close-btn");

                tutupbtn.addEventListener("click", function (){
                    succesPopup.setAttribute("hidden" , true);
                })

              });

              const tutupButton = document.getElementById("tutup-btn");

              tutupButton.addEventListener("click", function () {
                popUp.setAttribute("hidden", true);
              });

            });
            
            container.append(checkButton, trashButton);
        }
        return container;
    }

    function addTaskToCompleted (todoId) {
        const todoTarget = findTodo(todoId);
       
        if (todoTarget == null) return;
       
        todoTarget.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        savedData();
    }

    function findTodo(todoId) {
        for (const todoItem of todos) {
          if (todoItem.id === todoId) {
            return todoItem;
          }
        }
        return null;
    }

    function removeTaskFromCompleted(todoId){
        const todoTarget = findTodoindex(todoId);

        if(todoTarget == -1) return;
        
        todos.splice(todoTarget,1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        savedData();

    }

    function findTodoindex(todoId){
        for(let index in todos){
            if( todos[index].id == todoId){
                return index;
            }
        }

        return -1;
    }


    function undoTaskFromCompleted(todoId){
        const todoTarget = findTodo(todoId);

        if (todoTarget == null) return;
       
        todoTarget.isCompleted = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        savedData();
    }

    document.addEventListener(RENDER_EVENT, function (){
        const uncompletedTODOList = document.getElementById('buku-belum-dibaca');
        uncompletedTODOList.innerHTML = '';

        const completedTODOList = document.getElementById('buku-sudah-dibaca');
        completedTODOList.innerHTML = '';
       
        for (const todoItem of todos) {
            const todoElement = makeTodo(todoItem);
            if (!todoItem.isCompleted) {
              uncompletedTODOList.append(todoElement);
            }else{
                completedTODOList.append(todoElement);
            }
        }
    })

    const SAVED_EVENT = "SavedTodo";
    const storageKey = "BookSHelf_APP"


    function isStorageExist(){
        if (typeof (Storage) === undefined) {
            alert('Browser kamu tidak mendukung local storage');
            return false;
        }
        return true;
    }


    function savedData(){
        if(isStorageExist()){
            const Ubah = JSON.stringify(todos);
            localStorage.setItem(storageKey, Ubah);

            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }

    function loadDataFromStorage(){
        const fromStorage = JSON.parse(localStorage.getItem(storageKey));

        if(fromStorage !== null){
            for(const data of fromStorage){
                todos.push(data);
            }
        }

        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    document.addEventListener(SAVED_EVENT, function () {
        console.log(localStorage.getItem(storageKey));
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }

    const search = document.getElementById("search-btn");

    search.addEventListener("click", function () {
        const input = document.getElementById("search-input").value;

        const filter = todos.filter((n) => n.tittle.toLowerCase().includes(input.toLowerCase()));


        const uncompletedTODOList = document.getElementById('buku-belum-dibaca');
        uncompletedTODOList.innerHTML = '';

        const completedTODOList = document.getElementById('buku-sudah-dibaca');
        completedTODOList.innerHTML = '';

        for (const todoItem of filter) {
            const todoElement = makeTodo(todoItem);
            if (!todoItem.isCompleted) {
              uncompletedTODOList.append(todoElement);
            }else{
                completedTODOList.append(todoElement);
            }
        }

    })

})