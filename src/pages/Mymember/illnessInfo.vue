<template>
  <div>
    <div class="illness-box">
      <div class="illness-box__head">
        <p class="title">糖尿病：</p>
      </div>
      <div class="illness-box__head subhead">
        <p class="title">基础症状</p>
      </div>
      <div class="illness-box__main">
        <div class="item" @click="changeCheck('attrib01')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib01 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib01 === 'N'"></x-icon>多饮
        </div>
        <div class="item" @click="changeCheck('attrib02')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib02 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib02 === 'N'"></x-icon>多食
        </div>
        <div class="item" @click="changeCheck('attrib03')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib03 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib03 === 'N'"></x-icon>多尿
        </div>
        <div class="item" @click="changeCheck('attrib04')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib04 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib04 === 'N'"></x-icon>视力模糊
        </div>
        <div class="item" @click="changeCheck('attrib05')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib05 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib05 === 'N'"></x-icon>体重减轻(消瘦)
        </div>
        <div class="item" @click="changeCheck('attrib06')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib06 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib06 === 'N'"></x-icon>皮肤或外阴瘙痒
        </div>
        <group class="item">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib07"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="!checkList.attrib07"></x-icon>
          <x-input title="其他" :max="50" v-model="checkList.attrib07" placeholder="50字内"></x-input>
        </group>
      </div>
      <div class="illness-box__head subhead">
        <p class="title">并发症</p>
      </div>
      <div class="illness-box__main">
        <div class="check-inline">
          <span class="title">心：</span>
          <div class="content">
            <div class="item" @click="changeCheck('attrib08')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib08 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib08 === 'N'"></x-icon>心绞痛
            </div>
            <div class="item" @click="changeCheck('attrib09')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib09 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib09 === 'N'"></x-icon>心肌梗死
            </div>
            <div class="item" @click="changeCheck('attrib10')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib10 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib10 === 'N'"></x-icon>心衰
            </div>
          </div>
        </div>
        <div class="check-inline">
          <span class="title">脑：</span>
          <div class="content">
            <div class="item" @click="changeCheck('attrib11')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib11 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib11 === 'N'"></x-icon>脑梗死
            </div>
            <div class="item" @click="changeCheck('attrib12')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib12 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib12 === 'N'"></x-icon>脑出血
            </div>
            <div class="item" @click="changeCheck('attrib13')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib13 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib13 === 'N'"></x-icon>脑血栓
            </div>
          </div>
        </div>
        <div class="check-inline">
          <span class="title">肾：</span>
          <div class="content">
            <div class="item" @click="changeCheck('attrib14')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib14 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib14 === 'N'"></x-icon>尿蛋白
            </div>
            <div class="item" @click="changeCheck('attrib15')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib15 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib15 === 'N'"></x-icon>肾功能减弱
            </div>
            <div class="item" @click="changeCheck('attrib16')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib16 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib16 === 'N'"></x-icon>尿毒症
            </div>
          </div>
        </div>
        <div class="check-inline">
          <span class="title">眼：</span>
          <div class="content">
            <div class="item" @click="changeCheck('attrib17')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib17 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib17 === 'N'"></x-icon>视力模糊
            </div>
            <div class="item" @click="changeCheck('attrib18')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib18 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib18 === 'N'"></x-icon>视物减退
            </div>
            <div class="item" @click="changeCheck('attrib19')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib19 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib19 === 'N'"></x-icon>失明
            </div>
            <div class="item" @click="changeCheck('attrib20')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib20 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib20 === 'N'"></x-icon>疼痛、畏光、流泪
            </div>
          </div>
        </div>
        <div class="check-inline">
          <span class="title">眼肢体及神经：</span>
          <div class="content">
            <div class="item" @click="changeCheck('attrib21')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib21 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib21 === 'N'"></x-icon>感觉异常
            </div>
            <div class="item" @click="changeCheck('attrib22')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib22 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib22 === 'N'"></x-icon>间歇性跛行
            </div>
            <div class="item" @click="changeCheck('attrib23')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib23 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib23 === 'N'"></x-icon>坏疽
            </div>
            <group class="item">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib24"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="!checkList.attrib24"></x-icon>
              <x-input title="其他" :max="50" v-model="checkList.attrib24" placeholder="50字内"></x-input>
            </group>
          </div>
        </div>
      </div>
    </div>
    <div class="illness-box">
      <div class="illness-box__head">
        <p class="title">高血压：</p>
      </div>
      <div class="illness-box__head subhead">
        <p class="title">基础症状</p>
      </div>
      <div class="illness-box__main">
        <div class="item" @click="changeCheck('attrib25')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib25 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib25 === 'N'"></x-icon>头晕
        </div>
        <div class="item" @click="changeCheck('attrib26')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib26 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib26 === 'N'"></x-icon>头痛
        </div>
        <div class="item" @click="changeCheck('attrib27')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib27 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib27 === 'N'"></x-icon>胸闷
        </div>
        <div class="item" @click="changeCheck('attrib28')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib28 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib28 === 'N'"></x-icon>气短
        </div>
        <div class="item" @click="changeCheck('attrib29')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib29 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib29 === 'N'"></x-icon>耳鸣
        </div>
        <div class="item" @click="changeCheck('attrib30')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib30 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib30 === 'N'"></x-icon>心慌健忘
        </div>
        <div class="item" @click="changeCheck('attrib31')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib31 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib31 === 'N'"></x-icon>后颈部疼痛
        </div>
        <div class="item" @click="changeCheck('attrib32')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib32 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib32 === 'N'"></x-icon>鬓角两侧痛
        </div>
        <div class="item" @click="changeCheck('attrib33')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib33 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib33 === 'N'"></x-icon>视物模糊
        </div>
        <group class="item">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib34"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="!checkList.attrib34"></x-icon>
          <x-input title="其他" :max="50" v-model="checkList.attrib34" placeholder="50字内"></x-input>
        </group>
      </div>
      <div class="illness-box__head subhead">
        <p class="title">并发症</p>
      </div>
      <div class="illness-box__main">
        <div class="check-inline">
          <span class="title">心：</span>
          <div class="content">
            <div class="item" @click="changeCheck('attrib35')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib35 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib35 === 'N'"></x-icon>心绞痛
            </div>
            <div class="item" @click="changeCheck('attrib36')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib36 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib36 === 'N'"></x-icon>心肌梗死
            </div>
            <div class="item" @click="changeCheck('attrib37')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib37 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib37 === 'N'"></x-icon>心衰
            </div>
          </div>
        </div>
        <div class="check-inline">
          <span class="title">脑：</span>
          <div class="content">
            <div class="item" @click="changeCheck('attrib38')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib38 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib38 === 'N'"></x-icon>脑梗死
            </div>
            <div class="item" @click="changeCheck('attrib39')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib39 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib39 === 'N'"></x-icon>脑出血
            </div>
            <div class="item" @click="changeCheck('attrib40')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib40 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib40 === 'N'"></x-icon>高血压脑病
            </div>
          </div>
        </div>
        <div class="check-inline">
          <span class="title">肾：</span>
          <div class="content">
            <div class="item" @click="changeCheck('attrib41')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib41 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib41 === 'N'"></x-icon>尿蛋白
            </div>
            <div class="item" @click="changeCheck('attrib42')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib42 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib42 === 'N'"></x-icon>肾功能减弱
            </div>
            <div class="item" @click="changeCheck('attrib43')">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib43 === 'Y'"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib43 === 'N'"></x-icon>尿毒症
            </div>
            <group class="item">
              <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib44"></x-icon>
              <x-icon type="ios-circle-outline" size="24" v-show="!checkList.attrib44"></x-icon>
              <x-input title="其他" :max="50" v-model="checkList.attrib44" placeholder="50字内"></x-input>
            </group>
          </div>
        </div>
      </div>
    </div>
    <div class="illness-box">
      <div class="illness-box__head">
        <p class="title">高血脂：</p>
      </div>
      <div class="illness-box__head subhead">
        <p class="title">基础症状</p>
      </div>
      <div class="illness-box__main">
        <div class="item" @click="changeCheck('attrib45')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib45 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib45 === 'N'"></x-icon>脑梗死
        </div>
        <div class="item" @click="changeCheck('attrib46')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib46 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib46 === 'N'"></x-icon>冠心病
        </div>
        <div class="item" @click="changeCheck('attrib47')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib47 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib47 === 'N'"></x-icon>胰腺炎
        </div>
        <div class="item" @click="changeCheck('attrib48')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib48 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib48 === 'N'"></x-icon>黄色瘤
        </div>
      </div>
    </div>
    <div class="illness-box">
      <div class="illness-box__head">
        <p class="title">痛风：</p>
      </div>
      <div class="illness-box__head subhead">
        <p class="title">基础症状</p>
      </div>
      <div class="illness-box__main">
        <div class="item" @click="changeCheck('attrib49')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib49 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib49 === 'N'"></x-icon>关节红肿热痛
        </div>
        <div class="item" @click="changeCheck('attrib50')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib50 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib50 === 'N'"></x-icon>夜晚痛醒
        </div>
        <div class="item" @click="changeCheck('attrib51')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib51 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib51 === 'N'"></x-icon>关节功能障碍
        </div>
        <div class="item" @click="changeCheck('attrib52')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib52 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib52 === 'N'"></x-icon>体温偏高
        </div>
        <div class="item" @click="changeCheck('attrib53')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib53 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib53 === 'N'"></x-icon>关节肿胀
        </div>
        <div class="item" @click="changeCheck('attrib54')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib54 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib54 === 'N'"></x-icon>关节僵硬
        </div>
        <div class="item" @click="changeCheck('attrib55')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib55 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib55 === 'N'"></x-icon>关节畸形
        </div>
        <group class="item">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib56"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="!checkList.attrib56"></x-icon>
          <x-input title="其他" :max="50" v-model="checkList.attrib56" placeholder="50字内"></x-input>
        </group>
      </div>
    </div>
    <div class="illness-box">
      <div class="illness-box__head">
        <p class="title">肝病：</p>
      </div>
      <div class="illness-box__head subhead">
        <p class="title">基础症状</p>
      </div>
      <div class="illness-box__main">
        <div class="item" @click="changeCheck('attrib57')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib57 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib57 === 'N'"></x-icon>食欲下降
        </div>
        <div class="item" @click="changeCheck('attrib58')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib58 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib58 === 'N'"></x-icon>四肢乏力
        </div>
        <div class="item" @click="changeCheck('attrib59')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib59 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib59 === 'N'"></x-icon>容易疲劳
        </div>
        <div class="item" @click="changeCheck('attrib60')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib60 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib60 === 'N'"></x-icon>失眠
        </div>
        <div class="item" @click="changeCheck('attrib61')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib61 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib61 === 'N'"></x-icon>多梦
        </div>
        <div class="item" @click="changeCheck('attrib62')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib62 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib62 === 'N'"></x-icon>恶心
        </div>
        <div class="item" @click="changeCheck('attrib63')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib63 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib63 === 'N'"></x-icon>上腹部不适
        </div>
        <div class="item" @click="changeCheck('attrib64')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib64 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib64 === 'N'"></x-icon>腹胀
        </div>
        <div class="item" @click="changeCheck('attrib65')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib65 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib65 === 'N'"></x-icon>手掌表面充血发红
        </div>
        <div class="item" @click="changeCheck('attrib66')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib66 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib66 === 'N'"></x-icon>肝脾肿大
        </div>
        <div class="item" @click="changeCheck('attrib67')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib67 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib67 === 'N'"></x-icon>眼睛发黄
        </div>
        <div class="item" @click="changeCheck('attrib68')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib68 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib68 === 'N'"></x-icon>皮肤黄疸
        </div>
        <div class="item" @click="changeCheck('attrib69')">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib69 === 'Y'"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="checkList.attrib69 === 'N'"></x-icon>尿液发黄
        </div>
        <group class="item">
          <x-icon type="ios-checkmark-outline" size="24" v-show="checkList.attrib70"></x-icon>
          <x-icon type="ios-circle-outline" size="24" v-show="!checkList.attrib70"></x-icon>
          <x-input title="其他" :max="50" v-model="checkList.attrib70" placeholder="50字内"></x-input>
        </group>
      </div>
    </div>
    <div class="illness-box">
      <div class="illness-box__head">
        <p class="title">其他病症：</p>
      </div>
      <div class="illness-box__main">
        <group gutter="0" style="margin-bottom:58px;">
          <x-textarea :max="150" placeholder="150字内" v-model="checkList.otherDisease"></x-textarea>
          <selector title="家族病史" :options="familyHisList" v-model="checkList.familyHis"></selector>
          <checker
            v-model="familyHisRole"
            type="checkbox"
            default-item-class="check-item"
            selected-item-class="check-item-selected"
          >
            <checker-item
              :value="item"
              v-for="(item, index) in roleList"
              :key="index"
            >{{item.value}}</checker-item>
          </checker>
          <selector title="过敏史" :options="familyHisList" v-model="checkList.allergy"></selector>
          <x-input
            title="药品"
            placeholder="请输入过敏药品(50字)"
            :max="50"
            v-model="checkList.drug"
            v-show="checkList.allergy == 'Y'"
          ></x-input>
          <x-input
            title="食物吸入物"
            placeholder="请输入过敏食物吸入物(50字)"
            :max="50"
            v-model="checkList.food"
            v-show="checkList.allergy == 'Y'"
          ></x-input>
          <selector title="是否做过手术" :options="familyHisList" v-model="checkList.ops"></selector>
          <x-input title="手术名称" placeholder="请输入手术名称" v-model="checkList.opsName"></x-input>
        </group>
      </div>
    </div>
    <div class="submit-bar" :style="{bottom: 0}">
      <x-button
        type="primary"
        :show-loading="isStop"
        :disabled="isStop"
        @click.native="submitForm"
      >保存</x-button>
    </div>
  </div>
</template>

<script>
import {
  XButton,
  XInput,
  XTextarea,
  Checker,
  CheckerItem,
  Selector,
  Group
} from "vux";
import { getIllnessInfo, editIllnessInfo } from "@/api/mymember";
import { mapState } from "vuex";

export default {
  name: "illnessInfo",
  props: {
    custNo: {
      type: String,
      required: true
    }
  },
  components: {
    XButton,
    XInput,
    XTextarea,
    Checker,
    CheckerItem,
    Selector,
    Group
  },
  data() {
    return {
      isStop: false,
      familyHisList: [{ key: "Y", value: "有" }, { key: "N", value: "无" }],
      familyHisRole: [],
      roleList: [
        {
          key: "father",
          value: "父亲"
        },
        {
          key: "mother",
          value: "母亲"
        },
        {
          key: "borSister",
          value: "兄弟姐妹"
        },
        {
          key: "other",
          value: "其他"
        }
      ],
      checkList: {
        attrib01: "N",
        attrib02: "N",
        attrib03: "N",
        attrib04: "N",
        attrib05: "N",
        attrib06: "N",
        attrib07: "",
        attrib08: "N",
        attrib09: "N",
        attrib10: "N",
        attrib11: "N",
        attrib12: "N",
        attrib13: "N",
        attrib14: "N",
        attrib15: "N",
        attrib16: "N",
        attrib17: "N",
        attrib18: "N",
        attrib19: "N",
        attrib20: "N",
        attrib21: "N",
        attrib22: "N",
        attrib23: "N",
        attrib24: "",
        attrib25: "N",
        attrib26: "N",
        attrib27: "N",
        attrib28: "N",
        attrib29: "N",
        attrib30: "N",
        attrib31: "N",
        attrib32: "N",
        attrib33: "N",
        attrib34: "",
        attrib35: "N",
        attrib36: "N",
        attrib37: "N",
        attrib38: "N",
        attrib39: "N",
        attrib40: "N",
        attrib41: "N",
        attrib42: "N",
        attrib43: "N",
        attrib44: "",
        attrib45: "N",
        attrib46: "N",
        attrib47: "N",
        attrib48: "N",
        attrib49: "N",
        attrib50: "N",
        attrib51: "N",
        attrib52: "N",
        attrib53: "N",
        attrib54: "N",
        attrib55: "N",
        attrib56: "",
        attrib57: "N",
        attrib58: "N",
        attrib59: "N",
        attrib60: "N",
        attrib61: "N",
        attrib62: "N",
        attrib63: "N",
        attrib64: "N",
        attrib65: "N",
        attrib66: "N",
        attrib67: "N",
        attrib68: "N",
        attrib69: "N",
        attrib70: "",
        otherDisease: "",
        father: "N",
        mother: "N",
        borSister: "N",
        other: "N",
        allergy: "",
        drug: "",
        food: "",
        ops: "",
        opsName: ""
      }
    };
  },
  computed: {
    ...mapState({
      permission: state => state.mymember.permission
    })
  },
  watch: {},
  created() {},
  mounted() {
    this.getIllnessInfo();
  },
  methods: {
    async getIllnessInfo() {
      let { code, data } = await getIllnessInfo({ memberId: this.custNo });
      if (code === 200) {
        if (data && data.father == "Y") {
          this.familyHisRole.push({ key: "father", value: "父亲" });
        }
        if (data && data.mother == "Y") {
          this.familyHisRole.push({ key: "mother", value: "母亲" });
        }
        if (data && data.borSister == "Y") {
          this.familyHisRole.push({ key: "borSister", value: "兄弟姐妹" });
        }
        if (data && data.other == "Y") {
          this.familyHisRole.push({ key: "other", value: "其他" });
        }
        data ? (this.checkList = data) : "";
      }
    },
    async submitForm() {
      this.familyHisRole.forEach(el => {
        this.checkList[el.key] = "Y";
      });
      let { code } = await editIllnessInfo({
        memberId: this.custNo,
        ...this.checkList
      });
      if (code === 200) {
        this.$vux.toast.text("设置成功");
        this.$router.back(-1);
      }
    },
    changeCheck(key) {
      this.checkList[key] = this.checkList[key] === "Y" ? "N" : "Y";
    }
  }
};
</script>
<style lang="less" scoped>
.illness-box {
  &__head {
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &.subhead {
      background-color: #f2f2f2;
      .title {
        font-size: 14px;
        color: #333;
      }
    }
    .title {
      flex: 1;
      font-size: 16px;
      font-weight: 600;
      color: #ff6600;
    }
  }
  &__main {
    padding: 10px 15px;
    display: flex;
    flex-wrap: wrap;
    background-color: #fff;
    .check-inline {
      display: flex;
      .title {
        min-width: 3em;
        font-size: 14px;
        line-height: 24px;
        color: #44aa30;
      }
      .content {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
      }
    }
    .item {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #333;
      // min-width: 88px;
      margin-right: 10px;
      margin-bottom: 6px;
      /deep/ .weui-cells {
        margin: 0;
        display: flex;
        align-items: center;
        .weui-cell {
          padding: 0;
          flex: 1;
          &::before {
            content: none;
          }
          .weui-cell__bd {
            position: relative;
            padding-left: 10px;
            &::after {
              content: " ";
              position: absolute;
              left: 0;
              bottom: 0;
              right: 0;
              height: 1px;
              border-bottom: 1px solid #d9d9d9;
              color: #d9d9d9;
              -webkit-transform-origin: 0 0;
              transform-origin: 0 0;
              -webkit-transform: scaleY(0.5);
              transform: scaleY(0.5);
            }
          }
        }
      }
      .vux-x-icon {
        margin-right: 12px;
      }
      .vux-x-icon-ios-circle-outline {
        fill: #c9c9c9;
      }
      .vux-x-icon-ios-checkmark-outline {
        fill: #037de0;
      }
      .input {
        border-top: 0;
        border-left: 0;
        border-right: 0;
        font-size: 14px;
        outline: none;
        background-color: transparent;
      }
    }
  }
}
.submit-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  padding-left: 30px;
  padding-right: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 58px;
  background-color: #fff;
  box-sizing: border-box;
}
.vux-checker-box {
  text-align: center;
}

/deep/ .weui-cells {
  &::after,
  &::before {
    content: none;
  }
}

.check-item {
  width: 5em;
  height: 26px;
  font-size: 14px;
  line-height: 26px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  margin-right: 12px;
  margin-bottom: 12px;
}
.check-item-selected {
  background: #ffffff
    url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAMAAACecocUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTZDOEJBQ0E3NkIxMTFFNEE3MzJFOUJCMEU5QUM0QkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTZDOEJBQ0I3NkIxMTFFNEE3MzJFOUJCMEU5QUM0QkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBNkM4QkFDODc2QjExMUU0QTczMkU5QkIwRTlBQzRCQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNkM4QkFDOTc2QjExMUU0QTczMkU5QkIwRTlBQzRCQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnMGp3kAAAAJUExURf9KAP///////4Jqdw0AAAADdFJOU///ANfKDUEAAAAuSURBVHjaTMpBDgAABAPB5f+PlhLUpZMWuQcYMWLEyDN4ymqa5KS4+3G+KAEGACQmAGlKzr56AAAAAElFTkSuQmCC)
    no-repeat right bottom;
  border-color: #ff4a00;
}
.weui-btn_primary{
  background:rgba(0,202,172,1)
}
</style>