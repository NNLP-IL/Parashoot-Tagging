<template>
  <div class="HomePage container mt-3 mb-3"  dir = "rtl" align = "right">
    <div v-if="fileUploaded">
      <AnnotationsPage v-bind:json="json"/>
    </div>
    <div v-else>
      <h1>כתיבת שאלות על פסקאות מוויקיפדיה</h1>
      <hr>
  <p>
  במשימה זו תקבלו פסקאות אקראיות שנלקחו מערכים בוויקיפדיה. לכל פסקה תתבקשו לנסח שני סוגים של שאלות הבנת הנקרא:
  <br>
  <li>
  3-5 שאלות שיש להן תשובה בפסקה.
  </li>
  <li>1-2 שאלות <b>רלוונטיות</b> לפסקה, אך שאין להן תשובה בפסקה.</li>
  את <b><u>השאלות</u></b> נסחו <b>במילים שלכם</b> ו<b>בשפה חופשית</b> ככל האפשר.
  <br>
  <b><u>התשובה</u></b> היא <b>מילה או מחרוזת מילים מתוך הפסקה</b>, ואותה תסמנו על גבי הפסקה באמצעות העכבר.
  <br>
  <br>
  <h5 align = "right">
  טרם תחילת המשימה יש לקרוא בקפידה את 
  <b><a href="https://drive.google.com/file/d/1_arIKSy-fTqLihlsyMWl5pQ0v9NBrLuB/view?usp=sharing" target="_blank"
   > ההנחיות</a></b>.
    </h5> 
    מומלץ להשאיר את עמוד ההנחיות פתוח בחלון או בטאב נפרד בעת ביצוע המשימה.
    <br>
      <!-- <json-viewer :value="jsonData" :expand-depth="10" copyable></json-viewer> -->
      <!-- <br>
      <div class="uploadBar" align = "left">
        <b-form-file
          v-model="file"
          :state="Boolean(file)"
          placeholder="Upload a JSON file here"
          accept=".json"
        ></b-form-file>
      </div>
      <br>
      <b-button :size="''" :variant="'primary'" v-on:click="readFileFromUpload()">Upload</b-button>
      <br><br> -->
      <!-- <h5>אם אין לכם קובץ להעלות בחרו באופציה הבאה:</h5> -->
      <br>
      <h5>הדביקו כאן את ה-Prolific ID שלכם:</h5><input v-model="prolificID" placeholder="Prolific ID"  align="left"/>
      <br>
      <p style="color:red;">{{ errors }}</p>
      <br>
      <b-button :size="''" :variant="'primary'" v-on:click="getRandomFile()">בואו נתחיל</b-button>
    </div>
  </div>
</template>

<script>
import AnnotationsPage from "./AnnotationsPage.vue";

export default {
  name: "HomePage",
  data: function() {
    return {
      jsonData: {
        data: [
          {
            title: "Question answering",
            paragraphs: [
              {
                context:
                  "Question answering (QA) is a computer science discipline within the fields of information retrieval and natural language processing (NLP), which is concerned with building systems that automatically answer questions posed by humans in a natural language.",
                qas: []
              },
              {
                context:
                  "A QA implementation, usually a computer program, may construct its answers by querying a structured database of knowledge or information, usually a knowledge base. More commonly, QA systems can pull answers from an unstructured collection of natural language documents.",
                qas: []
              }
            ]
          },
          {
            title: "Natural language processing",
            paragraphs: "[...]"
          }
        ]
      },
      fileUploaded: false,
      file: null,
      json: null,
      jsonID: null,
      errors: "",    
      prolificID: "", 
    };
  },
  methods: {
    readFile: function (jsonID) {
      this.json = require("../json_resources/heb_squad-v1.1_" + this.pad(jsonID, 4) + ".json");
      this.json.jsonID = jsonID;
      this.fileUploaded = true;
    },
    readFileFromUpload: function() {
      var reader = new FileReader();
      reader.onload = function(event) {
        this.json = JSON.parse(event.target.result);
        this.fileUploaded = true;
        
      }.bind(this);
      reader.readAsText(this.file);
    },
    pad: function (num, size) {
      while (num.length < size) num = "0" + num;
      return num;
    },
    getRandomInt: function (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    checkID: function(){
      // eslint-disable-next-line no-console
      // console.log(this)
      if(this.prolificID == ""){
        this.errors = "שדה חובה";
        return false;
      }
      else{
          this.errors = "";
          return true;
      }
    },
    getRandomFile: function () {// When pressing the button!!!
      if(this.checkID() == true)
      {
        this.jsonID = this.getRandomInt(21, 399).toString();
        this.json = require("../json_resources/heb_squad-v1.1_" + this.pad(this.jsonID, 3) + ".json");
        this.json.jsonID = this.jsonID;
        this.json.prolificID = this.prolificID;
        this.fileUploaded = true;
      }
    },
    state: function (jsonID) {
      var intID = parseInt(jsonID)
      return intID > 0 && intID < 1200;
    }
    
  },
  components: {
    AnnotationsPage
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.uploadBar {
  max-width: 300px;
}
</style>
