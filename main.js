
var canvas, g;
var wrapper;
var gWidth, gHeight;

var gameCount;

var stage;
var mode;

var errorFlag;

var isOpeningStage;
var stageOneTutor, stageFourTutor, stageFiveTutor;
var tutorialImages;

var menuPosY;
var menuArrowAlpha;

var menuItemPositionX, propertyPositionX;
var focusItem;
var itemList, previewItemList;

var commandHistory, tmpCmdHistory;
var itemcommandHistory, propertycommandHistory;

var branchList;
var branchFlag;
var branchFocusItem;
var itemTMP;
var isItemExec;
var branchcommandHistory;

var isLoop;

var focusProperty;
var propertyList;

var menuFrame, menuFrameList;

var leftArrow, rightArrow;
var navigationGel;

var map, mapTip, mapTipCount;
var mapHeight, mapWidth;
var drawSize;

var cat, previewCat;
var tmpX, tmpY, tmpGelCount;
var tmpGelX, tmpGelY;

var tmpcommandHistory;

var gelFlag, allGelCount, remainGelCount;
var bombFlag;
var clearFlag;

var guide, guide2;
var dummyCat;

var isKeyDownI = false;
var isMenuUp = false;
var isMenuDown = false;
var isMenuRight = false;
var isMenuLeft = false;
var isReturned = false;
var isPositionDrawing = false;

var isRepeat = false;
var repeatX, repeatY;



const Scenes = {
  TitleScreen: 0,
  Stage1: 1,
  Stage2: 2,
  Stage3: 3,
  Stage4: 4,
  Stage5: 5,
}

const Mode = {
  Default: 0,
  Coding: 1,
}

const MapPart = {
  None: 0,
  Gel: 1,
  Bomb: 2,
  Enemy: 3,
  CollectGel: 4,
}

class TextBox {
  text = "unlocked";
  strokeColor = "#00EE00";
  strokeWidth = 5;
  fillColor = "#0000EE";
  fontSize = 36;
  fontColor = "#EE0000";
  alpha = 1.0;
  positionX = 0;
  positionY = 0;
  width = 0;
  height = 0;

  constructor(text, strokeColor, strokeWidth, fillColor, fontSize, fontColor, alpha, x, y, w, h) {
    this.text = text;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
    this.fillColor = fillColor;
    this.fontSize = fontSize;
    this.fontColor = fontColor;
    this.alpha = alpha;
    this.positionX = x;
    this.positionY = y;
    this.width = w;
    this.height = h;
  }

  update() {}

  draw(g) {
    myDrawStrokeRectangle(this.positionX, this.positionY, this.width, this.height, 5, myRGBA(this.strokeColor, this.alpha), this.strokeWidth);
    myDrawFillRectangle(this.positionX, this.positionY, this.width, this.height, 5, myRGBA(this.fillColor, this.alpha));

    myDrawText(this.text, this.fontSize, 'center', 'center', -(gWidth/2-(this.positionX+this.width/2)), -(gHeight/2-(this.positionY+this.height/2)), 'bold', 'x12y16pxMaruMonica', myRGBA("#777", this.alpha), myRGBA(this.fontColor, this.alpha), 5, "round");

    // console.log("aaa");
  }
}

// 座標で計算する
class GraphicData {
  image = null;
  positionX = 0;
  positionY = 0;
  isDraw = true;

  constructor(imagePath, x, y) {
    this.image = new Image();
    this.image.src = imagePath;
    this.positionX = x;
    this.positionY = y;
  }

  draw(g) {
    if (this.isDraw) {
      g.drawImage(this.image, this.positionX * 128 + 182, -(this.positionY) * 128 + 295);
    }
  }
  
  drawIMG(g) {
    g.drawImage(this.image, this.positionX, this.positionY);
  }
}

class Player extends GraphicData {
  stageGelCount = 0;
  totalGelCount = 0;

  update () {

  }
}

class GameObject extends GraphicData {
  flag = false;
  visible = false;
  type = 0;

  update () {

  }
}

class CommandHistory {
  cmdItem = [];
  cmdProperty = [];
  cmdBranch = [];

  constructor(cmdItem, cmdProperty, cmdBranch) {
    this.cmdItem = cmdItem;
    this.cmdProperty = cmdProperty;
    this.cmdBranch = cmdBranch;
  }

  push (itemData, propertyData, branchData) {
    if (this.cmdItem.length >= 10) {
      errorFlag = true;
    }
    else {
      this.cmdItem.push(itemData);
      this.cmdProperty.push(propertyData);
      this.cmdBranch.push(branchData);
    }
  }

  renew (tmpItem, tmpProperty, tmpBranch) {
    this.empty();

    tmpItem.forEach((data) => {
      this.cmdItem.push(data);
    });
    tmpProperty.forEach((data) => {
      this.cmdProperty.push(data);
    });
    tmpBranch.forEach((data) => {
      this.cmdBranch.push(data);
    });
  }

  empty () {
    this.cmdItem = [];
    this.cmdProperty = [];
    this.cmdBranch = [];
  }

  repeat () {
    this.cmdItem.forEach((data, i) => {
      if (commandHistory.cmdBranch[i] != -1) {
        switch(branchFocusItem) {
          case 1:
            if (gelFlag) {
              isItemExec = true;
            }
            else {
              isItemExec = false;
            }
            break;

          case 0:
            if (bombFlag) {
              isItemExec = true;
            }
            else {
              isItemExec = false;
            }
            break;

          case 2:
            if (gelFlag || bombFlag) {
              isItemExec = false;
            }
            else {
              isItemExec = true;
            }
            break;

          default:
            isItemExec = false;
            break;
        }
      }
      useItem(data, commandHistory.cmdProperty[i]);
    });
    if (gelFlag) {
      if (!(previewCat.positionX == 500 && previewCat.positionY == 270)) {
        map[previewCat.positionY][previewCat.positionX] = MapPart.CollectGel;
        tmpGelX.push(previewCat.positionX);
        tmpGelY.push(previewCat.positionY);
      }
      previewCat.stageGelCount ++;
      if (isRepeat) {
        remainGelCount--;
        console.log(map[previewCat.positionY][previewCat.positionX]);
        map[previewCat.positionY][previewCat.positionX] = MapPart.None;
        cat.totalGelCount++;
        console.log(previewCat.positionX);
      }
      console.log(gelFlag);
      console.log(cat.positionX);
      console.log(previewCat.positionX);
    }
  }

}

class Item {
  name = "";
  unlocked = false;

  constructor (name, unlocked) {
    this.name = name;
    this.unlocked = unlocked;
  }
}



onload = function () {

  // 描画コンテキストの取得
  canvas = document.getElementById("gamecanvas");
  g = canvas.getContext("2d");
  // 初期化
  init();
  // 入力処理の指定
  document.onkeydown = keydown;
  document.onkeyup = keyup;

  // ゲームループの設定 60FPS
  setInterval("gameloop()", 16);
};

function init() {
  gWidth = canvas.width; // 1200
  gHeight = canvas.height; // 700

  stage = Scenes.TitleScreen;
  mode = Mode.Default;

  isReturned = false;

  gameCount = 0;

  clearFlag = false;
  errorFlag = false;

  isOpeningStage = true;
  stageOneTutor = 1;
  stageFourTutor = 1;
  stageFiveTutor = 1;
  tutorialImages = new GraphicData("./images/tutorial1-1.png", 181, 102);

  commandHistory = new CommandHistory([], [], []);
  tmpCmdHistory  = new CommandHistory([], [], []);

  menuPosY = 750;
  menuArrowAlpha = 0;
  menuItemPositionX = 124;
  propertyPositionX = 118;

  menuFrameList = [];
  // menuFrame = new TextBox("", "#EEE", 5, "#404040", 0, "", 1.0, 84, 9999, 1112, 220);

  focusItem = 0;
  itemList = [
    new Item("++", true),
    new Item("--", true),
    new Item("= 500", false),
    new Item("= 270", false),
    new Item("+= 2", false),
    new Item("= 0", true),
    new Item("get", true),
    // new Item("return", true),
  ];
  focusProperty = 0;
  propertyList = [
    "cat.positionX",
    "cat.positionY",
  ];
  itemcommandHistory = [];
  propertycommandHistory = [];

  branchFlag = false;

  branchList = [];
  var data = new GraphicData("./images/jewel1l-4.png", 613, 470);
  branchList.push(data);
  data = new GraphicData("./images/none.png", 675, 470);
  branchList.push(data);
  data = new GraphicData("./images/bomb2.png", 551, 470);
  branchList.push(data);
  branchFocusItem = 1;
  isItemExec = true;
  branchcommandHistory = [];

  isLoop = false;

  leftArrow = new GraphicData("./images/leftArrow.png", 510, 478);
  rightArrow = new GraphicData("./images/rightArrow.png", 736, 478);
  navigationGel = new GraphicData("./images/jewel1l-4.png", 556, 58);

  guide = new GraphicData("./images/guide.png", 937, 0);
  guide2 = new GraphicData("./images/guide2.png", 937, 0);
  dummyCat = new GraphicData("./images/girl.png", 6, 2);

  // y軸反転注意
  map = [
    [0, 0, 0, 0, 0, 0, 1], // 床
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];
  mapHeight = 3;
  mapWidth  = 7;
  drawSize = 128;

  remainGelCount = 0;
  allGelCount = 0;
  for (var y = 0; y < mapHeight; y++) {
    for (var x = 0; x < mapWidth; x++) {
      if (map[y][x] == MapPart.Gel) {
        allGelCount ++;
      }
    }
  }

  mapTip = [];
  mapTipCount = Object.keys(MapPart).length -1;
  for (var i = 0; i <= mapTipCount; i++) {
    mapTip.push(new Image());
    if (i != 0) {
      mapTip[i].src = "./images/maptip" + i + ".png";
    }
  }

  tmpGelX = [];
  tmpGelY = [];

  cat = new Player("./images/girl.png", 0, 0);
  previewCat = new Player("./images/pipo-charachip010_08_preview.png", 0, 0);

  gelFlag = false;

  guide.isDraw = false;
  guide2.isDraw = false;
  dummyCat.isDraw = false;

  repeatX = 0;
  repeatY = 0;


}

function keydown(e) {
  if (e.code == 'KeyZ') {
  }

  if (e.code == 'KeyI'){
    if (menuPosY == 750) {
      isMenuUp = true;
      isKeyDownI = true;
      mode = Mode.Coding;

      tmpX = previewCat.positionX;
      tmpY = previewCat.positionY;
      tmpGelCount = previewCat.stageGelCount;
    }
    else if (menuPosY == 500) {
      isMenuDown = true;
      isKeyDownI = true;
      mode = Mode.Default;
    }
    // }
    // else {
    //   isKeyDownI = false;
    // }
  }

  if (e.code == 'KeyE') {
    if (mode == Mode.Default) {
      commandHistory.empty();
      tmpCmdHistory.empty();
    }
    else if (mode == Mode.Coding) {
      previewCat.positionX = tmpX;
      previewCat.positionY = tmpY;
      tmpCmdHistory.empty();
    }
  }

  if (e.code == 'KeyR') {
    isRepeat = true;
    commandHistory.repeat();
    cat.positionX = previewCat.positionX;
    cat.positionY = previewCat.positionY;
    if (previewCat.stageGelCount == allGelCount) {
      clearFlag = true;
      isReturned = true;
    }
    isRepeat = false;
  }


  if (e.code == 'Enter' && isOpeningStage) {
    if (stage == Scenes.TitleScreen) {
      init();
      stage = Scenes.Stage1;
    }
    else if (stage == Scenes.Stage1) {
      if (stageOneTutor < 5) {
        stageOneTutor++;
      }
      else {
        isOpeningStage = false;
        stageOneTutor = 1;
      }
    }
    else if (stage == Scenes.Stage4) {
      if (stageFourTutor < 3) {
        stageFourTutor++;
      }
      else {
        isOpeningStage = false;
        stageFourTutor = 1;
      }
    }
    else if (stage == Scenes.Stage5) {
      if (stageFiveTutor < 2) {
        stageFiveTutor++;
      }
      else {
        isOpeningStage = false;
        stageFiveTutor = 1;
      }
    }
    
    else {
      isOpeningStage = false;
    }
  }

  if (mode == Mode.Coding) {

    if (e.code == 'KeyL' || e.keyCode == 39) {
      if (branchFlag) {
        if (branchFocusItem < 2) {
          branchFocusItem ++;
        }
      }
      else {
        focusItem ++;
      }
    }
    if (e.code == 'KeyH' || e.keyCode == 37) {
      if (branchFlag) {
        if (branchFocusItem > 0) {
          branchFocusItem --;
        }
      }
      else {
        focusItem --;
      }
    }
    if (e.code == 'KeyJ' || e.keyCode == 40) {
      if (focusProperty <= 0){
        focusProperty = propertyList.length -1;
      }
      else {
        focusProperty --;
      }
    }
    if (e.code == 'KeyK' || e.keyCode == 38) {
      if (focusProperty >= propertyList.length -1){
        focusProperty = 0;
      }
      else {
        focusProperty ++;
      }
    }
    if (e.code == 'KeyX') {
      init();
    }
    if (e.code == 'KeyV') {
      isPositionDrawing = true;
    }
    if (e.code == 'KeyB') {
      if (branchFlag) {
        branchFlag = false;
      }
      else {
        branchFlag = true;
      }
    }
    if (e.code == 'Enter') {

      let itemIndex;
      let propertyIndex;
      let branchIndex;

      if (branchFlag) {
        branchIndex = branchFocusItem;
        switch(branchFocusItem) {
          case 1:
            if (gelFlag) {
              isItemExec = true;
            }
            else {
              isItemExec = false;
            }
            break;

          case 0:
            if (bombFlag) {
              isItemExec = true;
            }
            else {
              isItemExec = false;
            }
            break;

          case 2:
            if (gelFlag || bombFlag) {
              isItemExec = false;
            }
            else {
              isItemExec = true;
            }
            break;

          default:
            isItemExec = false;
            break;
        }
      }
      else {
        branchIndex = -1;
      }

      if (isItemExec) {
        itemIndex = selectItem();
      }

      if (!errorFlag && itemIndex != -1) {
        useItem(itemIndex, propertyList[focusProperty]);
        tmpCmdHistory.push(itemIndex, propertyList[focusProperty], branchIndex);
      }

      isItemExec = true;

    }
    if (e.code == 'F4') {
      previewCat.positionX = tmpX;
      previewCat.positionY = tmpY;
      previewCat.stageGelCount = tmpGelCount;
      errorFlag = false;

      for (var y = 0; y < mapHeight; y++) {
        for (var x = 0; x < mapWidth; x++) {
          if (map[y][x] == MapPart.CollectGel) {
            map[y][x] = MapPart.Gel;
          }
        }
      }
      tmpGelX = [];
      tmpGelY = [];

      tmpCmdHistory.empty();

      mode = Mode.Default;
    }
    if (e.code == 'F5') {
      repeatX = previewCat.positionX - repeatX;
      repeatY = previewCat.positionY - repeatY;
      cat.positionX = previewCat.positionX;
      cat.positionY = previewCat.positionY;
      remainGelCount = allGelCount - previewCat.stageGelCount;
      cat.totalGelCount += previewCat.stageGelCount;
      errorFlag = false;

      for (var y = 0; y < mapHeight; y++) {
        for (var x = 0; x < mapWidth; x++) {
          if (map[y][x] == MapPart.CollectGel) {
            map[y][x] = MapPart.None;
          }
        }
      }

      tmpGelX = [];
      tmpGelY = [];

      tmpCmdHistory.cmdItem.forEach((data, i) => {
        if (tmpCmdHistory.cmdProperty[i] == "cat.positionX") {
          switch(data) {

          }
        }
      });

      commandHistory.renew(tmpCmdHistory.cmdItem, tmpCmdHistory.cmdProperty, tmpCmdHistory.cmdBranch);
      tmpCmdHistory.empty();

      mode = Mode.Default;

      if (remainGelCount <= 0) {
        clearFlag = true;
        isReturned = true;
      }

    }

  }
}

function keyup(e) {}

function gameloop() {
  update();
  draw();
}

function update() {
  if (mode == Mode.Default && menuPosY <= 750) {
    isMenuDown = true;
  }
  else if (mode == Mode.Coding && menuPosY >= 500) {
    isMenuUp = true;
  }

  if (isReturned && clearFlag) {

    gameCount ++;

    if (gameCount >= 180) {

      isReturned = false;
      clearFlag = false;
      isOpeningStage = true;
      repeatX = 0;
      repeatY = 0;
      cat.positionX = 0;
      cat.positionY = 0;
      previewCat.positionX = 0;
      previewCat.positionY = 0;
      previewCat.stageGelCount = 0;
      gameCount = 0;

      tmpCmdHistory.empty();
      commandHistory.empty();

      unlockItem(cat.totalGelCount);

      // create stage
      switch (stage) {
        case Scenes.Stage1:
          map = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1],
          ];

          break;

        case Scenes.Stage2:
          map = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
          ];
          break;

        case Scenes.Stage3:
          map = [
            [0, 3, 1, 3, 1, 3, 1],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
          ];

          break;

        case Scenes.Stage4:
          map = [
            [0, 3, 1, 3, 2, 3, 1],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
          ];

          break;

        case Scenes.Stage5:
          map = [
            [0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
          ];

          break;

        default:
          break;
      }

      // gel count
      if (stage == Scenes.Stage2) {
        allGelCount = 1;
      }
      else {
        allGelCount = 0;
        for (var y = 0; y < mapHeight; y++) {
          for (var x = 0; x < mapWidth; x++) {
            if (map[y][x] == MapPart.Gel) {
              allGelCount++;
            }
          }
        }
      }

      // change stage
      if (stage != Scenes.Stage5) {
        stage ++;
      }
      else {
        stage = Scenes.Stage1;
      }


    }

  }

  if (stage == Scenes.Stage3 && (previewCat.positionX == 500 && previewCat.positionY == 270) || (cat.positionX == 500 && cat.positionY == 270)) {
    gelFlag = true;
  }
  else{
    switch (map[previewCat.positionY][previewCat.positionX]) {
      case MapPart.Gel:
        gelFlag = true;
        break;
  
      case MapPart.Bomb:
        bombFlag = true;
        break;
  
      case MapPart.Enemy:
        cat.positionX = 0;
        cat.positionY = 0;
        break;
  
      default:
        gelFlag = false;
        bombFlag = false;
        break;
    }
  }


  // if (remainGelCount <= 0) {
  //   clearFlag = true;
  // }
  // else {
  //   clearFlag = false;
  // }

  if (isMenuUp) {
    if (menuPosY > 500) {
      menuPosY -= 10;
      menuArrowAlpha += 0.04;
    }
    else {
      menuPosY = 500;
      menuArrowAlpha = 1.0;
      isMenuUp = false;
      isKeyDownI = false;
    }
  }

  if (isMenuDown) {
    if (menuPosY < 750) {
      menuPosY += 10;
      menuArrowAlpha -= 0.04;
    }
    else {
      menuPosY = 750;
      menuArrowAlpha = 0.0;
      isMenuDown = false;
      isKeyDownI = false;
    }
  }

}

function draw() {
  // bg
  myDrawFillRectangle(0, 0, gWidth, gHeight, 12, "#333");

  drawPickUpMessage();

  if (errorFlag) {
    myDrawText('- CODE LENGTH OVER -', 48, 'center', 'center', 0, 0, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
  }

  // inventory menu (off)
  myDrawText('I : OPEN MENU', 48, 'center', 'center', 0, 300, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");

  // inventory menu(on)
  drawInventoryMenu();

  // commandHistory
  if (mode == Mode.Default) {
    drawHistory(commandHistory);
  }
  else if (mode == Mode.Coding) {
    drawHistory(tmpCmdHistory);
  }

  myDrawFillRectangle(182, 429, 917, 5, 3, "#EEE");

  // map
  for (var y = 0; y < mapHeight; y++) {
    for (var x = 0; x < mapWidth; x++) {
      if (map[y][x] != MapPart.None) {
        g.drawImage(mapTip[map[y][x]], x * drawSize + 182, -y * drawSize + 295, drawSize, drawSize);
      }
      // else {
      // }
    }
  }



  if (stage == Scenes.Stage3) {

    if (cat.positionX == 500 && cat.positionY == 270) {
      if (remainGelCount == 0) {
        guide.isDraw = false;
        guide2.isDraw = true;
        guide2.drawIMG(g);
      }
      else {
        guide.drawIMG(g);
      }

      dummyCat.isDraw = true;
      dummyCat.draw(g);
    }
    else {
      guide.drawIMG(g);
    }

    myDrawFillRectangle(182, 429, 917, 5, 3, "#EEE");

  }

  // player
  previewCat.draw(g);
  cat.draw(g);

  if (isOpeningStage) {
    drawGuide();
  }

  // clear message
  if (isReturned && clearFlag) {
    myDrawText('GOOD JOB!', 60, 'center', 'center', 0, 0, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
  }

}

function selectItem () {
  let itemIndex;

  if (focusItem%itemList.length == 0) { // "++"
    itemIndex = 0;
  }
  else if (focusItem%itemList.length == 1 || focusItem%itemList.length == 1 -itemList.length) { // "--"
    itemIndex = 1;
  }
  else if (focusItem%itemList.length == 2 || focusItem%itemList.length == 2 -itemList.length) { // "= 500"
    itemIndex = 2;
  }
  else if (focusItem%itemList.length == 3 || focusItem%itemList.length == 3 -itemList.length) { // "= 270"
    itemIndex = 3;
  }
  else if (focusItem%itemList.length == 4 || focusItem%itemList.length == 4 -itemList.length) { // "+= 2"
    itemIndex = 4;
  }
  else if (focusItem%itemList.length == 5 || focusItem%itemList.length == 5 -itemList.length) { // "= 0"
    itemIndex = 5;
  }
  else if (focusItem%itemList.length == 6 || focusItem%itemList.length == 6 -itemList.length) { // "get"
    itemIndex = 6;
  }
  // else if (focusItem%itemList.length == 7 || focusItem%itemList.length == 7 -itemList.length) { // "return"
  //   itemIndex = 7;
  // }

  if (!itemList[itemIndex].unlocked) {
    itemIndex = -1;
  }

  return itemIndex;
}

function useItem (item, property) {

  switch (property) {
    case "cat.positionX":
      switch (item) {
        case 0:
          previewCat.positionX ++;
          break;

        case 1:
          previewCat.positionX --;
          break;

        case 2:
          previewCat.positionX = 500;
          break;

        case 3:
          previewCat.positionX = 270;
          break;

        case 4:
          previewCat.positionX += 2;
          break;

        case 5:
          previewCat.positionX = 0;
          break;

        case 6:
          if (gelFlag) {
            if (!(previewCat.positionX == 500 && previewCat.positionY == 270)) {
              map[previewCat.positionY][previewCat.positionX] = MapPart.CollectGel;
              tmpGelX.push(previewCat.positionX);
              tmpGelY.push(previewCat.positionY);
            }
            previewCat.stageGelCount ++;
            // gelCount --;
          }
          if (isRepeat && map[cat.positionY+repeatY][cat.positionX+repeatX] == MapPart.Gel) {
            map[cat.positionY+repeatY][cat.positionX+repeatX] = MapPart.None;
            tmpGelX.push(previewCat.positionX);
            tmpGelY.push(previewCat.positionY);
            previewCat.stageGelCount++;
            cat.totalGelCount++;
            if (cat.totalGelCount == allGelCount) {
              clearFlag = true;
              isReturned = true;
              console.log("ggggggg");
            }
            else {
              console.log(cat.totalGelCount);
              console.log(allGelCount);
            }
          }

          break;

        // case 7:
        //   if (clearFlag) {
        //     isReturned = true;
        //   }
        //   break;

        default:
          console.log("aaa");
          break;
      }
      break;

    case "cat.positionY":
      switch (item) {
        case 0:
          previewCat.positionY --;
          break;

        case 1:
          previewCat.positionY ++;
          break;

        case 2:
          previewCat.positionY = 500;
          break;

        case 3:
          previewCat.positionY = 270;
          break;

        case 4:
          previewCat.positionY += 2;
          break;

        case 5:
          previewCat.positionY = 0;
          break;

        case 6:
          if (gelFlag) {
            if (!(previewCat.positionX == 500 && previewCat.positionY == 270)) {
              map[previewCat.positionY][previewCat.positionX] = MapPart.CollectGel;
              tmpGelX.push(previewCat.positionX);
              tmpGelY.push(previewCat.positionY);
            }
            previewCat.stageGelCount ++;
            if (isRepeat) {
              remainGelCount--;
              console.log(map[previewCat.positionY][previewCat.positionX]);
              map[previewCat.positionY][previewCat.positionX] = MapPart.None;
              cat.totalGelCount++;
              console.log(previewCat.positionX);
            }

            // gelCount --;
          }
          break;

        case 7:
          if (clearFlag) {
            isReturned = true;
          }
          break;

      default:
        break;
      }
      break;

    default:
      break;
  }

}

function unlockItem (gelCount) {
  switch (gelCount) {
    case 2:
      itemList[2].unlocked = true;
      itemList[3].unlocked = true;
      break;

    case 3:
      itemList[4].unlocked = true;
      break;

    default:
      break;
  }
}

function drawGuide () {
  switch (stage) {
    case Scenes.TitleScreen:
      tutorialImages.positionX = 0;
      tutorialImages.positionY = 0;
      tutorialImages.image.src = "./images/titleScreen.png";
      break;

    case Scenes.Stage1:
      tutorialImages.image.src = "./images/tutorial1-"+stageOneTutor+".png";
      break;

    case Scenes.Stage2:
      tutorialImages.image.src = "./images/tutorial2-1.png";
      break;

    case Scenes.Stage3:
      tutorialImages.image.src = "./images/tutorial3-1.png";
      break;

    case Scenes.Stage4:
      tutorialImages.image.src = "./images/tutorial4-"+stageFourTutor+".png";
      break;

      case Scenes.Stage5:
      tutorialImages.image.src = "./images/tutorial5-"+stageFiveTutor+".png";
      break;

    default:
      break;
  }

  tutorialImages.drawIMG(g);
}

function drawHistory(historyObject) {
  historyObject.cmdItem.forEach((data, i) => {
    let item;
    switch(data) {
      case 0:
        item = '++';
        break;

      case 1:
        item = '--';
        break;

      case 2:
        item = '= 500';
        break;

      case 3:
        item = '= 270';
        break;

      case 4:
        item = '+= 2';
        break;

      case 5:
        item = '= 0';
        break;

      case 6:
        item = 'get';
        break;

      case 7:
        item = 'return';
        break;

      default:
        break;
    }

    if (historyObject.cmdProperty[i] == "cat.positionX") {
      myDrawText('X : '+item, 36, 'right', 'top', -30, 50+i*40, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
    }
    else if (historyObject.cmdProperty[i] == "cat.positionY") {
      myDrawText('Y : '+item, 36, 'right', 'top', -30, 50+i*40, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
    }

  });

}

function drawPickUpMessage() {
    // pickup message
    myDrawText('N A V I G A T I O N', 36, 'left', 'top', 30, 10, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
    myDrawText('- ←, → : menu scroll', 30, 'left', 'top', 30, 50, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
    myDrawText('- ↓, ↑ : property change', 30, 'left', 'top', 30, 50+35*1, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
    myDrawText('- I : item preview', 30, 'left', 'top', 30, 50+35*2, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
    myDrawText('- E : reset CODE', 30, 'left', 'top', 30, 50+35*3, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
    myDrawText('- R : repeat CODE', 30, 'left', 'top', 30, 50+35*4, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
    myDrawText('- B : branch mode', 30, 'left', 'top', 30, 50+35*5, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
    // myDrawText('- Z : redo', 30, 'left', 'top', 30, 50+35*6, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
  
    myDrawText('C O D E', 36, 'right', 'top', -30, 10, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
  
    myDrawText('M I S S I O N', 36, 'center', 'top', 0, 10, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
  
    if (previewCat.stageGelCount == allGelCount) {
      myDrawText('P R E S S   r e t u r n', 24, 'center', 'top', 0, 110, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
    }
    else {
      myDrawText('C O L L E C T   G E L', 24, 'center', 'top', 0, 110, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
    }
    myDrawText(' × '+ previewCat.stageGelCount +' / ' + allGelCount, 36, 'center', 'top', 30, 62, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
    navigationGel.drawIMG(g);
  
}

function drawInventoryMenu() {

  myDrawStrokeRectangle(84, menuPosY, 1112, 220, 5, myRGBA("#EEE", 1.0), 5); // wide frame
  myDrawFillRectangle(84, menuPosY, 1112, 220, 5, "#404040", 3);

  // item list
  let i, counter;
  let i_inv;
  for (i = focusItem-2, counter = 0; i <= focusItem+2; i++, counter++) {
    let diff = (180+33)*counter;
    let itemCenterX = menuItemPositionX+diff+180/2;

    // itemListの範囲を超えたらループ
    if (i < 0) { // 正方向
      i_inv = (itemList.length - 1) + (i+1) % itemList.length;
    }
    else { // 負方向
      i_inv = i % itemList.length;
    }

    if (i == focusItem) {
      myDrawStrokeRectangle(menuItemPositionX+diff-5, menuPosY+20-5, 190, 190, 5, "#CCC", 10); // item frame
      myDrawFillRectangle(menuItemPositionX+diff-5, menuPosY+20-5, 190, 190, 5, "#555", 3);
      if (itemList[i_inv].unlocked) {
        myDrawText(itemList[i_inv].name, 36, 'center', 'top', -(gWidth/2-itemCenterX), menuPosY+92, 'bold', 'x12y16pxMaruMonica', "#777", myRGBA("#EEE", 1.0), 5, "round");
      }
      else {
        myDrawText("locked", 36, 'center', 'top', -(gWidth/2-itemCenterX), menuPosY+92, 'bold', 'x12y16pxMaruMonica', "#777", myRGBA("#EEE", 1.0), 5, "round");
      }
    }
    else {
      myDrawStrokeRectangle(menuItemPositionX+diff, menuPosY+20, 180, 180, 5, myRGBA("#CCC", 0.5), 3); // item frame
      myDrawFillRectangle(menuItemPositionX+diff, menuPosY+20, 180, 180, 5, myRGBA("#555", 0.5), 3);
      if (itemList[i_inv].unlocked) {
        myDrawText(itemList[i_inv].name, 36, 'center', 'top', -(gWidth/2-itemCenterX), menuPosY+92, 'bold', 'x12y16pxMaruMonica', "#777", myRGBA("#EEE", 0.5), 5, "round");
      }
      else {
        myDrawText("locked", 36, 'center', 'top', -(gWidth/2-itemCenterX), menuPosY+92, 'bold', 'x12y16pxMaruMonica', "#777", myRGBA("#EEE", 0.5), 5, "round");
      }
    }

    // myDrawText(itemList[i], 36, 'center', 'top', 135+diff, menuPosY+92, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
  }

  // property box
  let propertyBox = new TextBox(propertyList[focusProperty], "#CCC", 10, "#555", 36, "#EEE", 1.0, 118, menuPosY-43, 199, 51);
  propertyBox.draw(g);

  // branch menu
  if (branchFlag) {
    myDrawStrokeRectangle(532, 465, 216, 67, 5, myRGBA("#EEE", 1.0), 5); // wide frame
    myDrawFillRectangle(532, 465, 216, 67, 5, "#404040", 3);
    branchList[0].drawIMG(g);
    branchList[1].drawIMG(g);
    branchList[2].drawIMG(g);
    myDrawStrokeRectangle(551+62*branchFocusItem, 470, 55, 55, 5, myRGBA("#EEE", 1.0), 3); // wide frame
    myDrawText('BRANCH MENU', 24, 'center', 'top', 0, 440, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");

    leftArrow.drawIMG(g);
    rightArrow.drawIMG(g);
  }

  g.strokeStyle = myRGBA("#EEE", menuArrowAlpha);
  g.fillStyle = myRGBA("#CCC", menuArrowAlpha);
  g.lineWidth = 2;

  // left navigation triangle
  g.beginPath();
  g.moveTo(66, 611);
  g.lineTo(95, 595);
  g.lineTo(95, 627);
  g.closePath();
  g.stroke();
  g.fill();

  // right navigation triangle
  g.beginPath();
  g.moveTo(1185, 595);
  g.lineTo(1185, 627);
  g.lineTo(1213, 611);
  g.closePath();
  g.stroke();
  g.fill();

  // myDrawStrokeRectangle(propertyPositionX, 457, 199, 51, 5, myRGBA("#EEE", 1.0), 5);
  // myDrawFillRectangle(propertyPositionX, 457, 199, 51, 5, "#404040", 3);

  // let propertyBoxCenter = propertyPositionX + 199/2;
  // myDrawText("cat.positionX", 36, 'center', 'top', -(gWidth/2-propertyBoxCenter), 457, 'bold', 'x12y16pxMaruMonica', "#777", myRGBA("#EEE", 1.0), 5, "round");


}

function myDrawText(text, fontSize, alignX, alignY, marginX, marginY, fontStyle, fontFamily, strokeColor, fillColor, width, join) {
  myStrokeText(text, fontSize, alignX, alignY, marginX, marginY, fontStyle, fontFamily, strokeColor, width, join);
  myFillText(text, fontSize, alignX, alignY, marginX, marginY, fontStyle, fontFamily, fillColor);
}

function myStrokeText(text, fontSize, alignX, alignY, marginX, marginY, fontStyle, fontFamily, strokeColor, width, join) {
  g.font = (
    fontStyle ? fontStyle : 'normal') + ' ' +
    fontSize + 'px ' +
    (fontFamily ? fontFamily : 'sans-serif');

  g.strokeStyle = strokeColor;

  g.lineWidth = width;
  g.lineJoin = join;

  g.strokeText(
    text,
    alignX === 'center' ?
      (gWidth - g.measureText(text).width) / 2 + marginX:
      alignX === 'right' ?
        gWidth - g.measureText(text).width + marginX:
        alignX && alignX !== 'left' ? alignX : marginX,
    alignY === 'center' ?
      (gHeight + fontSize / 2) / 2 + marginY:
      alignY === 'bottom' ?
          gHeight - fontSize / 4 + marginY:
          alignY && alignY !== 'top' ? alignY : fontSize + marginY
  );
}

function myFillText(text, fontSize, alignX, alignY, marginX, marginY, fontStyle, fontFamily, fillColor) {
  g.font = (
    fontStyle ? fontStyle : 'normal') + ' ' +
    fontSize + 'px ' +
    (fontFamily ? fontFamily : 'sans-serif');

  g.fillStyle = fillColor;

  g.fillText(
    text,
    alignX === 'center' ?
      (gWidth - g.measureText(text).width) / 2 + marginX:
      alignX === 'right' ?
        gWidth - g.measureText(text).width + marginX:
        alignX && alignX !== 'left' ? alignX : marginX,
    alignY === 'center' ?
      (gHeight + fontSize / 2) / 2 + marginY:
      alignY === 'bottom' ?
          gHeight - fontSize / 4 + marginY:
          alignY && alignY !== 'top' ? alignY : fontSize + marginY
  );
}

function myDrawStrokeRectangle(x,y,w,h,r,color,strokeWidth) {
  g.beginPath();
  g.lineWidth = strokeWidth;
  g.strokeStyle = color;
  // g.fillStyle = color;
  g.moveTo(x,y + r);
  g.arc(x+r,y+h-r,r,Math.PI,Math.PI*0.5,true);
  g.arc(x+w-r,y+h-r,r,Math.PI*0.5,0,1);
  g.arc(x+w-r,y+r,r,0,Math.PI*1.5,1);
  g.arc(x+r,y+r,r,Math.PI*1.5,Math.PI,1);
  g.closePath();
  g.stroke();
  // g.fill();
}

function myDrawFillRectangle(x,y,w,h,r,color) {
  g.beginPath();
  g.lineWidth = 1;
  // g.strokeStyle = color;
  g.fillStyle = color;
  g.moveTo(x,y + r);
  g.arc(x+r,y+h-r,r,Math.PI,Math.PI*0.5,true);
  g.arc(x+w-r,y+h-r,r,Math.PI*0.5,0,1);
  g.arc(x+w-r,y+r,r,0,Math.PI*1.5,1);
  g.arc(x+r,y+r,r,Math.PI*1.5,Math.PI,1);
  g.closePath();
  // g.stroke();
  g.fill();
}

function myRGBA (rgb, a) {
  let r, g, b;

  // #40 → #404040
  if (rgb.length == 3) {
    r = parseInt(rgb.substr(1, 2), 16).toString(10);
    g = parseInt(rgb.substr(1, 2), 16).toString(10);
    b = parseInt(rgb.substr(1, 2), 16).toString(10);
  }
  // #EEE → #EEEEEE
  else if (rgb.length == 4) {
    r = parseInt(rgb.substr(1, 1) + rgb.substr(1, 1), 16).toString(10);
    g = parseInt(rgb.substr(2, 1) + rgb.substr(2, 1), 16).toString(10);
    b = parseInt(rgb.substr(3, 1) + rgb.substr(3, 1), 16).toString(10);
  }

  else {
    r = parseInt(rgb.substr(1, 2), 16).toString(10);
    g = parseInt(rgb.substr(3, 2), 16).toString(10);
    b = parseInt(rgb.substr(5, 2), 16).toString(10);
  }

  return "rgba(" + r + "," + g + "," + b + "," + a.toString(10) + ")";
}
