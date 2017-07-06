/**
 * 扩展图表(Deprecated)
 *
 * Created by jinyong on 16-9-14.
 */
const RadialGauge = require("../../dependencies/gauge.radial.min");

export default {
    'chartRoundGauge' : /*@ngInject*/chartCustomGauge,
    'chartCanvasGauge' : /*@ngInject*/chartCanvasGauge
};

//圆形进度条
function chartCustomGauge() {

    var obj = {
        scope: false,
        restrict: 'CA',
        link: link
    };

    return obj;

    ////////

    function link(scope, element/*, attr, ctrl*/) {
        var canvas = element[0];
        var ctx = canvas.getContext("2d");
        //dimensions
        var W = canvas.width;
        var H = canvas.height;
        //Variables
        var degrees = 0;
        var new_degrees = 0;
        var difference = 0;
        var color = "lightgreen"; //green looks better to me
        var bgcolor = "#000";
        var text;
        var animation_loop, redraw_loop;

        function init()
        {
            //Clear the canvas everytime a chart is drawn
            ctx.clearRect(0, 0, W, H);

            //Background 360 degree arc
            ctx.beginPath();
            ctx.strokeStyle = bgcolor;
            ctx.lineWidth = 30;
            ctx.arc(W/2, H/2, 100, 0, Math.PI*2, false);
            ctx.stroke();

            //gauge will be a simple arc
            //Angle in radians = angle in degrees * PI / 180
            var radians = degrees * Math.PI / 180;
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 32;
            //The arc starts from the rightmost end. If we deduct 90 degrees from the angles
            //the arc will start from the topmost end
            ctx.arc(W/2, H/2, 100, 0 - 90*Math.PI/180, radians - 90*Math.PI/180, false);
            ctx.stroke();

            //Lets add the text
            ctx.fillStyle = color;
            ctx.font = "50px bebas";
            text = Math.floor(degrees/360*100) + "%";
            //Lets center the text
            //deducting half of text width from position x
            var text_width = ctx.measureText(text).width;
            //adding manual value to position y since the height of the text cannot
            //be measured easily. There are hacks but we will keep it manual for now.
            ctx.fillText(text, W/2 - text_width/2, H/2 + 15);
        }

        function draw()
        {
            //Cancel any movement animation if a new chart is requested
            if(typeof animation_loop !== undefined){ clearInterval(animation_loop);}

            //random degree from 0 to 360
            new_degrees = Math.round(Math.random()*360);
            difference = new_degrees - degrees;
            //This will animate the gauge to new positions
            //The animation will take 1 second
            //time for each frame is 1sec / difference in degrees
            animation_loop = setInterval(animate_to, 1000/difference);
        }

        //function to make the chart move to new degrees
        function animate_to()
        {
            //clear animation loop if degrees reaches to new_degrees
            if(degrees === new_degrees){
                clearInterval(animation_loop);
            }
            if(degrees < new_degrees){
                degrees++;
            }else{
                degrees--;
            }
            init();
        }

        //Lets add some animation for fun
        draw();
        redraw_loop = setInterval(draw, 3000); //Draw a new chart every 2 seconds
    }
}

//刻度型仪表
function chartCanvasGauge($interval, tools) {
    const obj = {
        scope: false,
        restrict: 'E',
        link: link
    };

    return obj;

    ////////

    function link(scope, element, attr/*, ctrl*/) {
        const colorsMap = {
            'red': '#D8361B',
            'blue': '#1790CF',
            'green': '#68A54A'
        };
        //通过参数color:获取颜色
        let themeColor = colorsMap[attr.color];
        themeColor = themeColor?themeColor:colorsMap.green;
        //初始化chart
        let gauge = new RadialGauge({
            //canvas element to draw gauge.
            renderTo: document.createElement('canvas'),
            //动画设定
            animationRule: 'linear',
            animationDuration: 500,
            //指针设定
            needleCircleInner: false,
            needleCircleOuter: true,
            needleCircleSize: 3,
            needleWidth: 5,
            needleType: "arrow",
            //边框(隐藏)
            borders: false,
            borderShadowWidth: 0,
            //百分比显示初始值设定
            valueText: '0%',
            valueBoxStroke: 0,
            //颜色设定
            colorPlate: "#fff",
            colorMajorTicks: themeColor,
            colorMinorTicks: themeColor,
            colorNumbers: themeColor,
            colorNeedle: themeColor,
            colorNeedleEnd: themeColor,
            colorValueText: themeColor,
            colorValueBoxBackground: "rgba(0, 0, 0, 0)",
            highlights: [
                {
                    "from": 80,
                    "to": 100,
                    "color": tools.convertColor().darker(themeColor)
                }
            ],
            //刻度设定
            strokeTicks: true,
            minorTicks: 10,
            majorTicks: [
                "0",
                "10",
                "20",
                "30",
                "40",
                "50",
                "60",
                "70",
                "80",
                "90",
                "100"
            ],
            fontNumbersSize: 20,
            //公共
            maxValue: 100,
            minValue: 0,
            height:300,
            width:300,
            //缩放比例
            customScale: 0.5
        }).draw();
        element.append(gauge.options.renderTo);

        //通过参数value:获取仪表要更新的值
        scope.$watch(attr.value, ()=>{
            let valueInt = scope[attr.value];
            gauge.value = valueInt?valueInt:0;
            gauge.update({"valueText": Math.round(gauge.value) + '%'});
        });
    }
}