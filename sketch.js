// Minesweeper game

function make2DArray(colsNum, rowsNum) {
    let arr = new Array(colsNum);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rowsNum);
    }
    return arr;
};

// Переменный для управления состоянием игры
var firstSetup = true;
var endGame = false;
var won = false;

let grid;
let cols;
let rows;
let w = 20; // w - width  - ширина одной ячейки

let totalMines = 55;

//  Подгружаемые файлы
let images = {
  mine: undefined,
  flag: undefined,
};

// Слайдеры
var sizeSlider;
var difSlider;


function preload() {
  images.mine = loadImage("img/mine.png");
  images.flag = loadImage("img/flag.png");
};

function setup() {
    cursor(HAND, 16, 16);
    if(firstSetup) {
        writeText();
        createCanvas(401, 401);
    }

    cols = floor(width / w);
    rows = floor(height / w);
    grid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = new Cell(i, j, w);
        }
    }

    // Выбираем места для всех мин totalMines
    let options = [];
    for (let i = 0; i < cols; i++ ) {
        for (let j = 0; j < rows; j++) {
            options.push([i, j]);
        }
    }

    for (let n = 0; n < totalMines; n++) {
        let index = floor(random(options.length));
        let option = options[index];
        let i = option[0];
        let j = option[1];

        // Удаляем место из options, чтобы мина повторно его не занимала
        options.splice(index, 1);
        grid[i][j].mine = true;
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].bombsCount();
        }
    }
    endGame = false;
    won = false;
};

function resetup() {
  firstSetup = false;
  w = width / sizeSlider.value();
  totalMines = difSlider.value();
	loop();
    setup();
};

let firstMousePress = true;

function mousePressed() {
    stroke(0);
    noFill();
    rect(this.x, this.y, this.w, this.w);
    if (this.revealed) {
        if (this.mine) {
            fill(127);
            ellipse(this.x + this.w * 0.5, this.y + this.w * 0.5, this.w * 0.5);
        } else {
                fill(200);
                rect(this.x, this.y, this.w, this.w);
            if (this.neighborCount > 0) {
                textAlign(CENTER);
                fill(0);
                text(this.neighborCount, this.x + this.w * 0.5, this.y + this.w - 6);
            }
        }
    }
};

function keyReleased() {
  if (key === 'z' || key === 'Z') {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (grid[i][j].contains(mouseX, mouseY)) {
          grid[i][j].marked = !grid[i][j].marked;
          return false;
        }
      }
    }
  }
  console.log("pressed: " + key);
  return false;
};

function draw() {
    background(255);

    let totalRevealed = 0;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].show();
            if (grid[i][j].revealed && !grid[i][j].mine) {
                totalRevealed++;
            }
        }
    }
    if (totalRevealed + totalMines >= cols * rows && !endGame) {
       noLoop();
       win();
    }

    if (endGame) {
        background(255, 160);

        stroke(143, 23, 23);
        fill(143, 23, 23);
        textSize(40);
        textAlign(CENTER);
        textFont("Trebuchet MS");
        text("GAME OVER", width / 2, height / 2);
    } else if (won) {
        background(115, 201, 107, 230);

        stroke(50, 175, 37);
        fill(50, 175, 37);
        textSize(40);
        textAlign(CENTER);
        textFont("Trebuchet MS");
        text("YOU WIN", width / 2, height / 2);
    }
};

function gameOver() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].revealed = true;
        }
    }
    // Текст оконч
    console.log("Игра окончена!");
    endGame = true;
};

function win() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].revealed = true;
    }
  }

  console.log("Ура, Вы победили!");
  won = true;
};

//.  Описание игры а так же управление игрой под холстом
function writeText() {
  let descr = createDiv('').size(width * 2, 170);
  descr.html("<p>Игра 'Сапер'. Целью игры является открытие всех ячеек, не содержащих мины. Чтобы открыть ячейку, <strong>кликните по ней</strong>. Числа в ячейке говорят  о том, сколько всего мин находится в восьми соседних ячейках, окружающих нажатую Вами ячейку (Пустая ячейка означает, что рядом нет мин).</p> <p>Игра автоматически откроет все ячейки, рядом с пустой ячейкой. Вы можете отмечать 'флажком' ячейки, в которых по Вашему внению находятся мины. Отмечать можно с помощью клавишы <strong>Z</strong>.</p><h4>Новая игра</h4><p>Размер поля:</p>");

  // createSlider(минимальное значение, масксимальное значение, значение по умолчанию, шаг)
  sizeSlider = createSlider(5, 30, 10, 1);
  createP("Сложность (% мин на поле):");
  difSlider = createSlider(1, 100, 15, 1);

  let redrawer = createButton("Создать поле");
  redrawer.mousePressed(resetup);
}
