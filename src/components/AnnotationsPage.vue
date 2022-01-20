<template>
  <div class="AnnotationsPage container mt-3">
    <div class="accordion" role="tablist">
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1 center" role="tab">
          <b-button block v-b-toggle.accordion-1 variant="info"><b>General Instructions</b> <br/>** Please
            read
            carefully before starting the annotation! **
          </b-button>
        </b-card-header>
        <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>
              <ul>
                <li>For each paragraph, type a question in the appropriate textbox and then select the
                  <b>minimal</b>
                  span of characters from the paragraph that contains the answer. The answer text
                  should
                  appear automatically in the answer prompt.
                </li>
                <li>Try to write questions using your own words as much as possible.</li>
                <li>Please make sure to write no more than<b> 5 questions </b>per paragraph (but
                  preferably 3
                  at
                  least).
                </li>
                <li>
                  You can save your work any time by clicking on the <b>Download</b> button below.
                </li>
                <li>
                  <b> Do not refresh the web page unless you downloaded your annotation file
                    first! </b>
                  (Otherwise
                  your work will be lost.)
                </li>
                <li>You can finish the annotation and quit any time by clicking on the <b>Finish</b> button.</li>
                <li>
                  Thank you very much for your effort!
                </li>
              </ul>
            </b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
    <div>
      <b-navbar sticky toggleable="lg" class="pl-0">
        <b-navbar-brand>cdQA-annotator</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto" justified>
            <b-nav-item>
              <svg-progress-bar :value="data_number / json.data.length * 100"
                                :options="options"></svg-progress-bar>
            </b-nav-item>
            <b-nav-item>
              <b-button
                  :variant="'primary'"
                  v-on:click="delete_empty_document()"
                  v-download-data="valid_json"
                  v-download-data:type="'json'"
                  v-download-data:filename="get_downloaded_file_name()"
              >Download
              </b-button>
            </b-nav-item>
            <b-nav-item active href="https://app.prolific.co/submissions/complete?cc=PROLIFIC_PROJECT_ID">
              <b-button
                  :variant="'primary'"
                  href="https://app.prolific.co/submissions/complete?cc=PROLIFIC_PROJECT_ID"
              >Finish
              </b-button>
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <br>
    <div v-if="data_number - 1 < json.data.length" dir="rtl">
      <h2 dir="rtl" class="text-right">{{ json.data[data_number - 1].title }}</h2>
      <span
          class="text-muted" dir="rtl"
      >Paragraph {{ context_number }} of {{ json.data[data_number - 1].paragraphs.length }} | Document {{ data_number }} of {{
          json.data.length
        }}</span>
      <br>
      <br>
      <p ref="paragraph" v-selection.fix="{getSelection:getSelection}" dir="rtl" class="text-right">{{
          paragraph_context
        }}</p>
      <br>

      <b-form-input v-model="question" type="text" placeholder="Type question here..." dir="rtl"></b-form-input>
      <br>

      <b-form-input v-model="answer" type="text" placeholder="Type answer here..." dir="rtl"></b-form-input>
      <br>

      <b-button :size="''" :variant="'secondary'" v-on:click="addAnnotation()">Add annotation</b-button>
      <br>
      <br>

      <b-table striped hover :items="items" :fields="fields">
        <template #cell(Edit)="row">
          <b-button :size="''" :variant="'danger'" @click.stop="deleteAnnotation(row.index)">Delete</b-button>
        </template>
      </b-table>
      <br>

      <div v-if="data_number > 1 && context_number == 1">
        <b-button
            :size="''"
            :variant="'outline-secondary'"
            v-on:click="data_number -= 1, context_number = json.data[data_number - 1].paragraphs.length"
        >Previous
        </b-button>
        or
        <b-button :size="''" :variant="'outline-primary'" v-on:click="context_number += 1">Next</b-button>
      </div>
      <div v-else-if="context_number < json.data[data_number - 1].paragraphs.length">
        <b-button
            :size="''"
            :variant="'outline-secondary'"
            v-on:click="context_number -= 1"
        >Previous
        </b-button>
        or
        <b-button :size="''" :variant="'outline-primary'" v-on:click="context_number += 1">Next</b-button>
      </div>
      <div v-else>
        <b-button
            :size="''"
            :variant="'outline-secondary'"
            v-on:click="context_number -= 1"
        >Previous
        </b-button>
        or
        <b-button
            :size="''"
            :variant="'outline-primary'"
            v-on:click="data_number += 1, context_number = 1, getNextBatch()"
        >Next
        </b-button>
      </div>
      <br>
      <br>
    </div>
    <div v-else>
      There are no more data to annotate. You can either quit or continue to the next annotation batch.
      <img
          src="../assets/ablobmaracas.gif"
          height="30"
          width="30"
      >
      <br>
      <b-button
          :size="''"
          :variant="'primary'"
          href="https://app.prolific.co/submissions/complete?cc=PROLIFIC_PROJECT_ID"
      >Finish Annotation
      </b-button>
      <br>
      <br>
      <b-button
          :size="''"
          :variant="'primary'"
          v-on:click="getRandomFile()"
      >Gimme another one!
      </b-button>
    </div>
  </div>
</template>

<script>

const uuidv4 = require('uuid/v4');

export default {
  name: "AnnotationsPage",
  props: ["json", "jsonID"],


  data: function () {
    return {
      data_number: 1,
      context_number: 1,
      question: "",
      answer: "",
      selectedAnswer: "",
      fields: ["Questions", "Answers", "Edit"],
      query: "",
      publicPath: process.env.BASE_URL,
      isSubmitted: false,
      textSelected: false,
      uuid: uuidv4(),
      prolificUserId: this.getParameterByName()
    };
  },
  methods: {
    addAnnotation: function () {
      if (!this.validateAnswer()) {
        return;
      }
      let paragraph_container = this.json.data[this.data_number - 1].paragraphs[
      this.context_number - 1
          ];
      let qa = {
        question: this.question,
        id: uuidv4(),
        answers: [{answer_start: this.answer_start, text: this.selectedAnswer}]
      };
      if (this.selectedAnswer.length > 50) {
        this.$confirm("The selected answer is too long! Are you sure you want to submit?").then(() => {
          paragraph_container.qas.push(qa);
          this.question = "";
          this.answer = "";
          this.selectedAnswer = "";
          this.textSelected = false;
          this.saveJSON();
        });
      } else {
        paragraph_container.qas.push(qa);
        this.question = "";
        this.answer = "";
        this.selectedAnswer = "";
        this.textSelected = false;
        this.saveJSON();
      }
    },
    validateAnswer: function () {
      if (this.question == '') {
        window.alert('Please fill in a question!');
        return false;
      }
      if (!this.textSelected || this.answer == '' || this.selectedAnswer != this.answer) {
        window.alert('The answer text must be selected from the paragraph!');
        return false;
      }
      return true;
    },
    deleteAnnotation: function (row_index) {
      let paragraph_container = this.json.data[this.data_number - 1].paragraphs[
      this.context_number - 1
          ];
      paragraph_container.qas.splice(row_index, 1);
      this.saveJSON();
    },
    getSelection: function (fixStr) {
      this.answer = fixStr;
      this.selectedAnswer = fixStr;
      this.textSelected = true;
    },
    delete_paragraph: function () {
      let paragraph_container = this.json.data[this.data_number - 1].paragraphs;
      paragraph_container.splice([this.context_number - 1], 1);
      this.saveJSON();
    },
    delete_empty_document: function () {
      for (var i in this.json.data) {
        if (this.json.data[i].paragraphs.length == 0) {
          this.json.data.splice(i, 1);
        }
      }
    },
    get_downloaded_file_name: function () {
      let tmpJsonID = this.json.jsonID;
      // delete this.json.jsonID;
      return "annotated_data_" + tmpJsonID + ".json";
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
    getRandomFile: function () {
      this.jsonID = this.getRandomInt(21, 2684).toString();
      this.json = require("../../src/json_resources/heb_squad-v1.1_" + this.pad(this.jsonID, 4) + ".json");
      this.json.jsonID = this.jsonID;

      this.data_number = 1;
      this.uuid = uuidv4();
    },

    saveJSON: function () {
      this.json.prolificUserId = this.prolificUserId;
      this.axios.post("URL/upload",
          {
            'json_data': JSON.stringify(this.json),
            'filename': "heb_squad-v1.1_" + this.pad(this.json.jsonID, 4) + "_" + this.uuid + "_" + this.prolificUserId + ".json"
          }
      ).catch(error => {
        this.errorMessage = error;
        window.alert('There was an error saving the JSON file.', error);
      });
    },

    getNextBatch: function () {
      if (this.data_number - 1 < this.json.data.length) {
        return true;
      }
      this.getRandomFile();
    },
    getParameterByName: function () {
      let queryDict = {};
      location.search.substr(1).split("&").forEach(function (item) {
        queryDict[item.split("=")[0]] = item.split("=")[1]
      });
      if ("PROLIFIC_PID" in queryDict) {
        return queryDict["PROLIFIC_PID"];
      }
      return "";
    },
  },
  computed: {
    valid_json: function () {
      let json = JSON.stringify(this.json).replace(/[\u007F-\uFFFF]/g, function (
          chr
      ) {
        return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
      });
      return json;
    },
    autocomplete: function () {
      let idx = [];
      for (let i = 0; i < this.json.data.length; i++) {
        idx.push(this.json.data[i].title);
      }
      return idx;
    },
    items: function () {
      let paragraph_container = this.json.data[this.data_number - 1].paragraphs[
      this.context_number - 1
          ];
      let items = [];
      for (var i = 0; i < paragraph_container.qas.length; i++) {
        let item = {
          Questions: paragraph_container.qas[i].question,
          Answers: paragraph_container.qas[i].answers[0].text
        };
        items.push(item);
      }
      return items;
    },
    paragraph_context: function () {
      return this.json.data[this.data_number - 1].paragraphs[
      this.context_number - 1
          ].context;
    },
    answer_start: function () {
      return this.paragraph_context.indexOf(this.selectedAnswer);
    },
    options() {
      return {
        radius: 15,
        circleLineCap: "round",
        varyStrokeArray: [1, 2],
        pathColors: ["lightgrey", "rgb(40, 167, 69)"],
        text: function (value) {
          return (
              this.htmlifyNumber(value) + '<span style="font-size: 1em;">%</span>'
          );
        },
        textColor: "black"
      };
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
