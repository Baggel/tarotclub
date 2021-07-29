<template>
<div class="wrap">
    <div class="chat-header">TarotClub - Salon de discussion</div>
    <div id="chatWindow" class="container">
    </div>
    <form class="msger-inputarea">
      <input type="text" class="msger-input" placeholder="Enter your message...">
  </form>
</div>

</template>

<style scoped>
.wrap { 
    height: 100%; width: 100%; 
    display: flex;
    flex-direction: column;
      background: #eee;
}
.chat-header {
  padding: 10px;
  border-bottom: var(--border);
  background: #eee;
  color: #666;
  position: relative;
  top:0;
  width: 100%;
  height: 50px;
  
}
.container {
    margin-bottom: 90px; display: flex; flex-direction: column; justify-content: flex-start;
    background-color: #eee; overflow: auto;
}

.chat-message:hover {
  background-color: gold;
}

.msger-inputarea {
  position: fixed;
  width: 100%;
  height: 60px;
  bottom: 0;
  padding: 10px;
  border-top: var(--border);
  background: #eee;
}
.msger-inputarea * {
  padding: 5px;
  border: none;
  border-radius: 3px;
  font-size: 1em;
}
.msger-input {
  /* flex: 1;
   */
  width: 380px;
  background: #ddd;
}

</style>


<script>
/*
<section class="msger">
  <header class="msger-header">
    <div class="msger-header-title">
      <i class="fas fa-comment-alt"></i> TarotClub - Salon de discussion
    </div>
    <div class="msger-header-options">
      <span><i class="fas fa-cog"></i></span>
    </div>
  </header>

  <main class="msger-chat">
    <div class="msg left-msg">
      <div
       class="msg-img"
       style="background-image: url(https://image.flaticon.com/icons/svg/327/327779.svg)"
      ></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">BOT</div>
          <div class="msg-info-time">12:45</div>
        </div>

        <div class="msg-text">
          Hi, welcome to SimpleChat! Go ahead and send me a message. 😄
        </div>
      </div>
    </div>

    <div class="msg right-msg">
      <div
       class="msg-img"
       style="background-image: url(https://image.flaticon.com/icons/svg/145/145867.svg)"
      ></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">Sajad</div>
          <div class="msg-info-time">12:46</div>
        </div>

        <div class="msg-text">
          You can change your name in JS section!
        </div>
      </div>
    </div>
  </main>

  <form class="msger-inputarea">
    <input type="text" class="msger-input" placeholder="Enter your message...">
  </form>
</section>


*/
const BOT_MSGS = [
  "Hi, how are you?",
  "Ohh... I can't understand what you trying to say. Sorry!",
  "I like to play games... But I don't know how to play!",
  "Sorry if my answers are not relevant. :))",
  "I feel sleepy! :("
];

// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "https://image.flaticon.com/icons/svg/327/327779.svg";
const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
const BOT_NAME = "BOT";
const PERSON_NAME = "Sajad";

export default {
  data() {
    return {
        msgerForm: null ,
        msgerInput: null,
        msgerChat: null,
    };
  },
  mounted() {

      this.msgerForm = this.get(".msger-inputarea");
      this.msgerInput = this.get(".msger-input");
      this.msgerChat = this.get(".container");

      this.msgerForm.addEventListener("submit", event => {
        event.preventDefault();

        const msgText = this.msgerInput.value;
        if (!msgText) return;

        this.appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
        this.msgerInput.value = "";

        this.botResponse();
      });

  },
  computed: {
   
  },
  methods: {
      appendMessage(name, img, side, text) {
        //   Simple solution for small apps
        const msgHTML = `<msg class="chat-message"><p><b>${name}</b>: ${text}</p></msg>`;

        this.msgerChat.insertAdjacentHTML("beforeend", msgHTML);
        this.msgerChat.scrollTop = this.msgerChat.scrollHeight - this.msgerChat.clientHeight;
      },
      botResponse() {
        const r = this.random(0, BOT_MSGS.length - 1);
        const msgText = BOT_MSGS[r];
        const delay = msgText.split(" ").length * 100;

        setTimeout(() => {
          this.appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
        }, delay);
      },

      // Utils
      get(selector, root = document) {
        return root.querySelector(selector);
      },

      formatDate(date) {
        const h = "0" + date.getHours();
        const m = "0" + date.getMinutes();

        return `${h.slice(-2)}:${m.slice(-2)}`;
      },

      random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      },
  },
};
</script>
