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
  5 שאלות שיש להן תשובה בפסקה.
אם אינכם מצליחים לנסח 5 שאלות, אפשר לנסח 4 שאלות, או 3 (מינימום), אבל השתדלו לנסח 5.
  </li>

  <li>2 שאלות <b>רלוונטיות</b> לפסקה, אך אין להן תשובה בפסקה (במקום לסמן תשובה נכונה יש לסמן מסיח שאינו התשובה הנכונה).<br>
     אם אינכם מצליחים לנסח 2 שאלות, נסחו לפחות שאלה אחת.
  </li>
  <br>
  את <b><u>השאלות</u></b> נסחו <b>במילים שלכם</b> ו<b>בשפה חופשית</b> ככל האפשר.
  <br>
  <b><u>התשובה</u></b> היא <b>מילה או מחרוזת מילים מתוך הפסקה</b>, ואותה תסמנו על גבי הפסקה באמצעות העכבר.
  <br>
  לכל שאלה בעלת מענה יש לסמן את התשובה הנכונה, אך <b>גם לכל שאלה חסרת מענה יש לסמן תשובה מוגדרת</b> - מעין מסיח שנראה כמו תשובה מתקבלת על הדעת, אך אינו תשובה נכונה.
  <br>
  משך המשימה הוא <b><u>שעה וחצי</u></b>
  <br>
  <h5 align = "right">
  טרם תחילת המשימה יש לקרוא בקפידה את 
  <b><a href="https://drive.google.com/file/d/1oxE7JOVDjV9FnRgtgFUOV61e86Fsrp2Z/view?usp=sharing" target="_blank" v-on:click="guideClicked" v-on:auxclick="guideClicked"
   > ההנחיות</a></b>.
    </h5> 
    (מומלץ להשאיר את עמוד ההנחיות פתוח בחלון או בטאב נפרד בעת ביצוע המשימה.)
    <br>
  קראו את ההנחיות ביסודיות, ולאחר מכן הקדישו כ-<u>9-10 דקות</u> ל-7 שאלות (פסקה אחת): <u><b>סה״כ 8 פסקאות</b></u>.
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
      <!-- <h5>הדביקו כאן את ה-Prolific ID שלכם:</h5><input v-model="prolificID" placeholder="Prolific ID"  align="left"/> -->
      <br>
      <p style="color:red;">{{ errors }}</p>
      <br>
      <b-button :size="''" :variant="'primary'" v-on:click="getRandomFile()">בואו נתחיל</b-button>
    </div>
  </div>
</template>

<script>
import AnnotationsPage from "./AnnotationsPage.vue";
import firebase from '../firebase'
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
      prolificID: this.getParameterByName("PROLIFIC_PID"),
      studyID : this.getParameterByName("STUDY_ID"),
      guide:null,
      min:400,
      max:1389,

    };
  },
  methods: {
    readFile: function (jsonID) {
      this.json = require("../json_resources/heb_squad-v1.1_" + this.pad(jsonID, 6) + ".json");
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
    guideClicked: function () {
      this.guide = "pass"
    },
    checkID: function(){
      // eslint-disable-next-line no-console
      // console.log(this)
      if(this.prolificID == ""){
        this.errors = "שדה חובה";
        return false;
      }
      else if(this.guide != "pass"){
          this.errors = "חובה לקרוא את ההנחיות לפני שמתחילים";
        return false
      }
      else{
          this.errors = "";
          return true;
      }
    },
    getRandomFile: async function () {// When pressing the button!!!
      if(this.checkID() == true)
      {
        this.jsonID = this.getOpenNumber().toString();
        this.json = require("../json_resources/heb_squad-v1.1_" + this.pad(this.jsonID, 6) + ".json");
        this.json.jsonID = this.jsonID;
        this.json.prolificID = this.prolificID;
        this.json.studyID = this.studyID;
        this.fileUploaded = true;
      }
    },
    getOpenNumber: function(){
      let num;
      let rand =0;
      do{
        rand = rand +1;
        num =  this.getRandomInt(this.min, this.max).toString();
      }while(this.alreadyAnnotatedFiles.includes(this.pad(num, 6)) && rand < 100);
      return num;
    },
    getParameterByName: function (name) {
      let queryDict = {};
      location.search.substr(1).split("&").forEach(function (item) {
        queryDict[item.split("=")[0]] = item.split("=")[1]
      });
      if (name in queryDict) {
        return queryDict[name];
      }
      return "";
    },
    state: function (jsonID) {
      var intID = parseInt(jsonID)
      return intID > 0 && intID < 1200;
    }
    
  },
  computed: {
    alreadyAnnotatedFiles:function(){
      let alreadyAnnotated = [];
      firebase.firestore().collection("annotations").onSnapshot((querySnapshot) => {
         querySnapshot.forEach((doc) => {
           let extractfilename = doc.data();
           extractfilename = doc.data().filename.substring(15, 21);
           if(!alreadyAnnotated.includes(extractfilename))
              alreadyAnnotated.push(extractfilename);
         })
      });
      // eslint-disable-next-line no-console
      console.log(alreadyAnnotated)
      return alreadyAnnotated;
    },
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
