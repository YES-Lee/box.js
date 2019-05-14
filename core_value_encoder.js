/**
 * 
 * @author Johnson
 * @email 598465252@qq.com
 * @version 1.0.1
 * 
 * @name 核心价值观编码器
 *
 */
/* ===========================免责申明======================================================
 * ===========================该程序仅供技术交流使用===========================================
 * ===========================请勿用于商业用途================================================
 * ===========================否则后果自行承担================================================
 * ========================================================================================
*/

/* ===========================感谢作者：sym233 提供编码器代码==================================
 * ==============================编码器源码地址：https://github.com/sym233/core-values-encoder
 * ========================================================================================
 * ========================================================================================
 * ========================================================================================
*/
function assert(...express){
  const l = express.length;
  const msg = (typeof express[l-1] === 'string')? express[l-1]: 'Assert Error';
  for(let b of express){
      if(!b){
          throw new Error(msg);
      }
  }
}

function randBin(){
  return Math.random() >= 0.5;
}

const values = '富强民主文明和谐自由平等公正法治爱国敬业诚信友善';

function str2utf8(str){
  // return in hex

  const notEncoded = /[A-Za-z0-9\-\_\.\!\~\*\'\(\)]/g;
  const str1 = str.replace(notEncoded, c=>c.codePointAt(0).toString(16));
  let str2 = encodeURIComponent(str1);
  const concated = str2.replace(/%/g, '').toUpperCase();
  return concated;
}

function utf82str(utfs){
  assert(typeof utfs === 'string', 'utfs Error');

  const l = utfs.length;

  assert((l & 1) === 0);

  const splited = [];

  for(let i = 0; i < l; i++){
      if((i & 1) === 0){
          splited.push('%');
      }
      splited.push(utfs[i]);
  }

  return decodeURIComponent(splited.join(''));
}

function hex2duo(hexs){
  // duodecimal in array of number

  // '0'.. '9' -> 0.. 9
  // 'A'.. 'F' -> 10, c - 10    a2fFlag = 10
  //          or 11, c - 6      a2fFlag = 11
  assert(typeof hexs === 'string')

  const duo = [];

  for(let c of hexs){
      const n = Number.parseInt(c, 16);
      if(n < 10){
          duo.push(n);
      }else{
          if(randBin()){
              duo.push(10);
              duo.push(n - 10);
          }else{
              duo.push(11);
              duo.push(n - 6);
          }
      }
  }
  return duo;
}

function duo2hex(duo){
  assert(duo instanceof Array);

  const hex = [];

  const l = duo.length;

  let i = 0;

  while(i < l){
      if(duo[i] < 10){
          hex.push(duo[i]);
      }else{
          if(duo[i] === 10){
              i++;
              hex.push(duo[i] + 10);
          }else{
              i++;
              hex.push(duo[i] + 6);
          }
      }
      i++;
  }
  return hex.map(v=>v.toString(16).toUpperCase()).join('');
}


function duo2values(duo){
  return duo.map(d=>values[2*d]+values[2*d+1]).join('');
}

function valuesDecode(encoded){
  const duo = [];

  for(let c of encoded){
      const i = values.indexOf(c);
      if(i === -1){
          continue;
      }else if(i & 1){
          continue;
      }else{
          // i is even
          duo.push(i >> 1);
      }
  }
  
  const hexs = duo2hex(duo);

  assert((hexs.length & 1) === 0);

  let str;
  try{
      str = utf82str(hexs);
  }catch(e){
      throw e;
  }
  return str;
}

function valuesEncode(str){
  return duo2values(hex2duo(str2utf8(str)));
}
/* ========================================================================================
 * ========================================================================================
*/

function completeTool (input_id) {
  return {
    type: "view",
    props: {
      height: 44
    },
    views: [
      {
        type: 'button',
        props: {
          title: '完成'
        },
        layout: function(make, view) {
          make.height.equalTo(32)
          make.width.equalTo(60)
          make.right.inset(10)
          make.centerY.equalTo(view.super)
        },
        events: {
          tapped (sender) {
            $(input_id).blur()
          }
        }
      }
    ]
  }
}

$ui.render({
  props: {
    title: "核心价值观编码器",
    // navBarHidden: true
  },
  views: [
    {
      type: "text",
      props: {
        id: "original_text",
        placeholder: '输入需要编码的文字',
        borderWidth: 1,
        borderColor: $color('#999'),
        radius: 10,
        accessoryView: completeTool('original_text')
      },
      layout: function(make, view) {
        make.centerX.equalTo(view.super)
        make.top.left.right.inset(10)
        make.height.equalTo(100)
      },
      events: {
        ready () {
          $('original_text').text = $clipboard.text
        }
      }
    },
    {
      type: 'view',
      props: {
        id: 'control_bar'
      },
      layout (make, view) {
        make.top.equalTo($('original_text').bottom).offset(10)
        make.width.equalTo(view.super)
        make.height.equalTo(40)
        make.left.right.inset(10)
      },
      views: [
        {
          type: 'button',
          props: {
            id: 'encode_btn',
            title: '编码'
          },
          layout (make, view) {
            make.height.equalTo(view.super)
            make.left.inset(0)
            make.width.equalTo(100)
          },
          events: {
            tapped () {
              $('processed_text').text = valuesEncode($('original_text').text)
              $('original_text').blur()
            }
          }
        },
        {
          type: 'button',
          props: {
            id: 'decode_btn',
            title: '解码'
          },
          layout (make, view) {
            make.height.equalTo(view.super)
            make.width.equalTo(100)
            make.left.equalTo($('encode_btn').right).offset(10)
          },
          events: {
            tapped () {
              $('processed_text').text = valuesDecode($('original_text').text)
              $('original_text').blur()
            }
          }
        },
        {
          type: 'button',
          props: {
            id: 'bopy_result_btn',
            title: '拷贝结果'
          },
          layout (make, view) {
            make.height.equalTo(view.super)
            make.width.equalTo(100)
            make.left.equalTo($('decode_btn').right).offset(10)
          },
          events: {
            tapped () {
              $clipboard.copy({
                text: $('processed_text').text,
                ttl: 60 * 10,
                locally: false
              })
              $ui.toast('结果已拷贝')
            }
          }
        }
      ]
    },
    {
      type: "text",
      props: {
        id: "processed_text",
        placeholder: '',
        borderWidth: 1,
        borderColor: $color('#999'),
        radius: 10,
        editable: false
      },
      layout: function(make, view) {
        make.centerX.equalTo(view.super)
        make.top.equalTo($('control_bar').bottom).offset(10)
        make.left.right.inset(10)
        make.height.equalTo(150)
      },
      events: {
        ready () {
        }
      }
    }
  ]
});