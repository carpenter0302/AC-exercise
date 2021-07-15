const GAME_STATE = {  //狀態機，裡面定義了所有的遊戲狀態。
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardsMatchFailed: "CardsMatchFailed",
  CardsMatched: "CardsMatched",
  GameFinished: "GameFinished",
}

const Symbols = [
  'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
  'https://image.flaticon.com/icons/svg/105/105220.svg', // 愛心
  'https://image.flaticon.com/icons/svg/105/105212.svg', // 方塊
  'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
]

const view = {
  getCardContent(index) { //取得正面
    const number = this.transformNumber((index % 13) + 1)
    const symbol = Symbols[Math.floor(index / 13)]

    return `
      <p>${number}</p>
      <img src="${symbol}">
      <p>${number}</p>
      `
  },

  getCardElement(index) { //取得背面。需要把卡片索引 (0~51) 綁定在牌背的 template 裡，運用 data-set 
    return `
      <div class="card back" data-index="${index}">  
      </div>
    `
  },

  transformNumber(number) {
    switch (number) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return number
    }
  },

  displayCards(indexes){  //把打散的陣列傳進去
   const rootElement = document.querySelector('#cards')
   rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join('') //用 map 迭代陣列，並依序將數字丟進 view.getCardElement() 
      // 把陣列合併成一個大字串，才能當成 HTML template 來使用 
  },

  flipCards(...cards) {  //翻牌。...可以把陣列展開成個別的值，也可以把個別的值蒐集起來變成陣列。
    cards.map(card => {
      if (card.classList.contains('back')) {  //如果點選時是背面會轉為正面
      card.classList.remove('back')
      card.innerHTML = this.getCardContent(Number(card.dataset.index))
      return
     }
      else{   //如果點選時是正面會轉為背面
      card.classList.add('back')
      card.innerHTML = null
     }
    })
  },

  pairCards(...cards){ //配對成功且停留住
    cards.map(card =>{
      card.classList.add('paired')
    })   
  },

  renderScore(score){
    document.querySelector('.score').innerHTML = `Score: ${score}`;

  },

  renderTriedTimes(times){
    document.querySelector('.tried').innerHTML = `You've tried: ${times} times`;
  },

  appendWrongAnimation(...cards){
    cards.map(card =>{
      card.classList.add('wrong')      //卡片加入 .wrong 類別，一旦加入就會開始跑動畫
      card.addEventListener('animationend', event => {  //一旦動畫跑完一輪，就把 .wrong 這個 class 拿掉
      event.target.classList.remove('wrong'),
        { once: true }  //在事件執行一次之後，就要卸載這個監聽器
    })
  })   
  }


}


const controller = {   //controller 會依遊戲狀態來分配動作
  currentState: GAME_STATE.FirstCardAwaits,
  generateCards(){
    view.displayCards(utility.getRandomNumberArray(52))
  },
  dispatchCardAction(card){ //會依照不同的遊戲狀態，做不同的行為
  if(!card.classList.contains('back')){ //牌如果已經翻開，就不用理他了
    return 
  }

  switch(this.currentState){
    case GAME_STATE.FirstCardAwaits:
      view.flipCards(card) //翻開(第一張)卡片
      model.revealedCards.push(card)
      this.currentState = GAME_STATE.SecondCardAwaits 
      break 
       
    case GAME_STATE.SecondCardAwaits:
      view.flipCards(card) //翻開(第二張)卡片
      view.renderTriedTimes(model.triedTimes += 1)
      model.revealedCards.push(card)
 
      if (model.isRevealedCardsMatched()) {  //判斷配對是否成功，如果配對正確
        view.renderScore(model.score +=10 ) //配對成功 +10
        this.currentState = GAME_STATE.CardsMatched
        view.pairCards(...model.revealedCards)

        //只要不去呼叫 flipCard，卡片就會維持翻開。

        model.revealedCards = []
        this.currentState = GAME_STATE.FirstCardAwaits
      }
      else {  //配對錯誤
        this.currentState = GAME_STATE.CardsMatchFailed
        view.appendWrongAnimation(...model.revealedCards)
        setTimeout(this.resetCards, 1000) //不加()是因為setTimeout是要把function本身當參數，而不是function的回傳值
      }
      break
  }
    console.log(this.currentState)
    console.log(model.revealedCards)
  },

  resetCards(){
    view.flipCards(...model.revealedCards) //配對錯誤要再翻回背面
    model.revealedCards = []
    controller.currentState = GAME_STATE.FirstCardAwaits //我們把 resetCards 當成參數傳給 setTimeout 時，this的對象變成了 setTimeout
  }
}




const model = {
  revealedCards: [],  //暫存被翻開的卡片。集滿兩張牌時就要檢查配對有沒有成功，檢查完以後就清空

  isRevealedCardsMatched(){ //比較第一張牌與第二張是否一樣
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  },

  score : 0,
  triedTimes: 0
}


const utility = {  //utility 概念像是外掛函式庫
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys())   //Array.from 可以從「類似陣列」的物件來建立陣列
    for (let index = number.length - 1 ; index > 0 ; index--){
      let randomIndex = Math.floor(Math.random() * (index + 1));
      [number[index], number[randomIndex]] = [number[randomIndex], number[index]] //解構賦值 (destructuring assignment) 
    }
    return number
  }
}


controller.generateCards()


// Node-List(array like)
document.querySelectorAll('.card').forEach(card =>{
  card.addEventListener('click', event =>{
  controller.dispatchCardAction(card)
  })
})
