<template>
  <div>
    <div v-if="flag == '0'">
      <div v-for="(item, index) in questions" :key="'questions-' + index">
        <div class="questions">
          <div class="questions__title">
            <span v-show="item.required == 'Y'" class="must">*</span>
            {{index + 1 + ' . ' + item.question}}({{item.queType}})
          </div>
          <div class="questions__main" v-if="item.queType == '单选'">
            <a
            style="display:block"
              class="answers"
              v-for="(citem, cindex) in item.answerList"
              :key="cindex"
              @click="changeAnswer(index, cindex, 'radio')"
            >
              <i class="weui-icon-checked" v-if="item.checked !== cindex"></i>
              <i class="weui-icon-checked checked" v-else></i>
              <p class="answers__main">{{citem.answer}}</p>
            </a>
          </div>
          <div class="questions__main" v-else-if="item.queType == '多选'">
            <div class="answers" v-for="(citem, cindex) in item.answerList" :key="cindex">
              <a style="display:block" @click="changeAnswer(index, cindex, 'checkbox')">
                <i class="weui-icon-checked" v-if="!item.checkeds.includes(cindex)"></i>
                <i class="weui-icon-checked checked" v-else></i>
              </a>
              <a
                class="answers__main"
                v-show="citem.ansType == '选择'"
                @click="changeAnswer(index, cindex, 'checkbox')"
              >{{citem.answer}}</a>
              <group class="answers__main" v-show="citem.ansType == '文本'">
                <x-textarea
                  placeholder="请输入文本"
                  v-model="citem.answer"
                  :show-counter="false"
                  :rows="1"
                  @on-focus="check(index, cindex)"
                  @on-blur="changeCheck(index, cindex)"
                ></x-textarea>
              </group>
            </div>
          </div>
          <div class="questions__main" v-else-if="item.queType == '文本'">
            <div class="answers" v-for="(citem, cindex) in item.answerList" :key="cindex">
              <group class="answers__main">
                <x-textarea v-model="citem.answer"></x-textarea>
              </group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="flag == '1'">
      <div v-for="(item, index) in newQuestions" :key="'answer-' + index">
        <div class="questions">
          <div class="questions__title">
            <span v-show="item.required == 'Y'" class="must">*</span>
            {{index + 1 + ' . ' + item.question}}({{item.queType}})
          </div>
          <div class="questions__main" v-if="item.queType == '单选'">
            <div class="answers" v-for="(citem, cindex) in item.answerList" :key="cindex">
              <i
                class="weui-icon-checked checked"
                v-if="item.userAnswerList[0].answerId == citem.answerId"
              ></i>
              <i class="weui-icon-checked" v-else></i>
              <p class="answers__main">{{citem.answer}}</p>
            </div>
          </div>
          <div class="questions__main" v-else-if="item.queType == '多选'">
            <div class="answers" v-for="(citem, cindex) in item.answerList" :key="cindex">
              <div>
                <i
                  class="weui-icon-checked checked"
                  v-if="item.userAnswerList.some(el=> el.answerId == citem.answerId )"
                ></i>
                <i class="weui-icon-checked" v-else></i>
              </div>
              <p class="answers__main" v-show="citem.ansType == '选择'">{{citem.answer}}</p>
              <group class="answers__main" v-show="citem.ansType == '文本'">
                <p>{{citem.answer}}</p>
              </group>
            </div>
          </div>
          <div class="questions__main" v-else-if="item.queType == '文本'">
            <div class="answers" v-for="(citem, cindex) in item.userAnswerList" :key="cindex">
              <group class="answers__main">
                <p>{{citem.comments}}</p>
              </group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="button-footbar" v-if="flag == '0'">
      <x-button type="primary" @click.native="getAnswer" :show-loading="stop">提交</x-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Checklist, XTextarea, XButton, Group } from "vux";
import { getResearchDetail, editAnswerCommit } from "@/api/mymember";
export default {
  name: "getResearchDetail",
  props: {
    id: {
      type: String,
      required: true
    },
    flag: {
      type: String,
      required: true
    }
  },
  components: { Checklist, XTextarea, XButton, Group },
  data() {
    return {
      questions: [],
      newQuestions: [],
      answers: [],
      stop: false
    };
  },
  computed: {
    ...mapState({
      memberInfo: state => state.mymember.memberInfo
    })
  },
  created() {},
  mounted() {
    this.getResearchDetail();
  },
  methods: {
    async getResearchDetail() {
      let { code, data } = await getResearchDetail({
        surveyId: this.id,
        flag: this.flag
      });
      if (code === 200) {
        if (this.flag == "0") {
          this.questions = data;
          this.questionsInit();
        } else {
          this.newQuestions = data;
        }
      }
    },
    questionsInit() {
      // 问题初始化
      if (this.questions.length === 0 || this.flag == "1") return;
      this.questions.forEach((el, index) => {
        this.$set(el, "checked", -1);
        this.$set(el, "checkeds", []);
      });
    },
    changeAnswer(index, cindex, type) {
      if (type === "radio") {
        this.$set(this.questions[index], "checked", cindex);
      } else if (type === "checkbox") {
        const checkeds = this.questions[index].checkeds;
        if (checkeds.includes(cindex)) {
          // 取消
          let _index = checkeds.indexOf(cindex);
          checkeds.splice(_index, 1);
        } else {
          // 选中
          checkeds.push(cindex);
        }
        this.$set(this.questions[index], "checkeds", checkeds);
      }
    },
    check(index, cindex) {
      const checkeds = this.questions[index].checkeds;
      if (!checkeds.includes(cindex)) {
        // 选中
        checkeds.push(cindex);
      }
      this.$set(this.questions[index], "checkeds", checkeds);
    },
    changeCheck(index, cindex) {
      const checkeds = this.questions[index].checkeds;
      let answer = this.questions[index].answerList[cindex].answer;
      if (answer === "" || answer === "其他") {
        if (checkeds.includes(cindex)) {
          // 取消
          let _index = checkeds.indexOf(cindex);
          console.log(_index);
          checkeds.splice(_index, 1);
        }
      } else {
        // 选中
        if (!checkeds.includes(cindex)) {
          checkeds.push(cindex);
        }
      }
      this.$set(this.questions[index], "checkeds", checkeds);
    },
    async getAnswer() {
      if (this.stop) return;
      this.stop = true;
      let mark = false;
      // 生成答案数组
      const questions = this.questions;
      questions.forEach(el => {
        let answerItem = {
          volumeID: this.id,
          questionId: el.quesId,
          ansType: "",
          answer: "",
          answerId: ""
        };
        if (el.queType === "单选") {
          if (el.required === "Y" && el.checked === -1) {
            mark = true;
            this.$vux.toast.show({
              text: "请注意必填项",
              type: "warn"
            });
            return;
          }
          if (el.checked > -1) {
            answerItem.ansType = el.answerList[el.checked].ansType;
            answerItem.answer = el.answerList[el.checked].answer;
            answerItem.answerId = el.answerList[el.checked].answerId;
            this.answers.push(answerItem);
          }
        }
        if (el.queType === "多选") {
          let _checkeds = el.checkeds;
          if (el.required === "Y" && _checkeds.length === 0) {
            mark = true;
            this.$vux.toast.show({
              text: "请注意必填项",
              type: "warn"
            });
            return;
          }
          if (_checkeds.length > 0) {
            for (let i = 0; i < _checkeds.length; i++) {
              answerItem.ansType = el.answerList[_checkeds[i]].ansType;
              answerItem.answer = el.answerList[_checkeds[i]].answer;
              answerItem.answerId = el.answerList[_checkeds[i]].answerId;
              this.answers.push(answerItem);
            }
          }
        }
        if (el.queType === "文本") {
          if (el.required === "Y" && !!el.answerList[0].answer) {
            mark = true;
            this.$vux.toast.show({
              text: "请注意必填项",
              type: "warn"
            });
            return;
          }
          if (el.answerList[0].answer) {
            answerItem.ansType = el.answerList[0].ansType;
            answerItem.answer = el.answerList[0].answer;
            answerItem.answerId = el.answerList[0].answerId;
            this.answers.push(answerItem);
          }
        }
      });
      if (mark) {
        this.stop = false;
        return;
      }
      let { code } = await editAnswerCommit({
        volumeID: this.id,
        custNo: this.memberInfo.custNo,
        answerList: this.answers
      });

      if (code === 200) {
        this.$vux.toast.text("提交成功");
        this.$router.back(-1);
      } else {
        this.stop = false;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.questions {
  &__title {
    margin-top: 0.77em;
    margin-bottom: 0.3em;
    padding-left: 15px;
    padding-right: 15px;
    color: #999999;
    font-size: 14px;
    & > .must {
      font-size: 12px;
      color: #fc2828;
    }
  }
  &__main {
    background-color: #ffffff;
    line-height: 1.41176471;
    font-size: 16px;
    overflow: hidden;
    position: relative;
    .answers {
      padding: 10px 15px;
      position: relative;
      display: flex;
      align-items: center;
      &__main {
        font-size: 14px;
      }
    }
  }
}

.button-footbar {
  margin: 30px 15px;
}

/deep/ .weui-cells {
  margin-top: 0;
  &::after {
    content: none;
  }
  &::before {
    content: none;
  }
}

.weui-icon-checked:before {
  content: "\EA01";
  color: #c9c9c9;
  font-size: 23px;
  display: block;
}
.weui-icon-checked.checked::before {
  content: "\EA06";
  color: #ff9900;
}
</style>