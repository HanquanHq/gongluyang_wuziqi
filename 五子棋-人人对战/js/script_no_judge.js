//在F12 console控制台可以查看报错
var me = true;
var chessBoard = [];//每个点的占用情况，二维数组
for(var i=0; i<15;i++)
{
	chessBoard[i] = [];//第一维每个元素再定义一个数组
	for(var j=0; j<15;j++)
	{
		chessBoard[i][j] = 0;//0代表没有占用
	}
}

var chess = document.getElementById('chess');
var context = chess.getContext('2d');/*参数 contextID 指定了您想要在画布上绘制的类型。当前唯一的合法值是 "2d"*/

context.strokeStyle = "#1F1F1F";//改变描边的颜色

var i;//i用来画棋盘
var background = new Image();//background用来画背景
background.src = "images/wooden.jpg";
//image对象的unload方法,因为加载需要时间

background.onload = function()//回调函数
{
	context.drawImage(background, 0, 0, 600,600);
	drawChessBoard();
}

//封装成一个函数，在背景图片之后调用，避免木纹背景挡住棋盘格
var drawChessBoard = function()
{
	for(i=0; i<15; i++)//画棋盘格
	{
		context.moveTo(20+i*40, 20);//竖线
		context.lineTo(20+i*40, 580);//两边分别留20px白边
		context.stroke();/*调用stroke才真正划线*/
		context.moveTo(20, 20+i*40);//横线
		context.lineTo(580, 20+i*40);
		context.stroke();/*调用stroke才真正划线*/
	}
}
//封装一个函数，用来画棋子
var oneStep = function(i, j, me)//i,j表示棋子的位置，me表示黑棋或者白棋(true/false)
{
	context.beginPath();//调用此来开始一个路径
	context.arc(20+i*40, 20+j*40, 18, 0, 2*Math.PI);//arc可以用来画扇形（圆心坐标x，圆心坐标y，圆的半径，扇形的起始弧度和终止弧度）
	context.closePath();//与beginpath对应
	var color_change = context.createRadialGradient(20+i*40, 20+j*40, 18, 20+i*40+3, 20+j*40-3, 4);//调用渐变函数，会返回一个渐变对象
	//以上 第一个圆心x，y，半径1，第二个圆心x，第二个圆心y，半径2
	if(me)//黑色
	{
		color_change.addColorStop(0,"#0A0A0A");//黑色 0代表百分比，对应第一个圆的位置
		color_change.addColorStop(1,"#636766");//灰色 1代表百分比  里面的小圆
	}
	else//白色
	{
		color_change.addColorStop(1,"#F2F2F2");//黑色 0代表百分比，对应第一个圆的位置
		color_change.addColorStop(0,"#CCCCCC");//灰色 1代表百分比  里面的小圆
	}
	
	context.fillStyle = color_change;//棋子的填充色是渐变对象
	context.fill();//stroke是描边s，fill是填充
}

//鼠标点击落子
chess.onclick = function(e)//onclick事件，参数e
{
	
	var x = e.offsetX; //offsetX,offsetY 发生事件的地点在事件源元素的坐标系统中的 x 坐标和 y 坐标
	var y = e.offsetY;
	var i = Math.floor(x / 40);
	var j = Math.floor(y / 40);
	if(chessBoard[i][j] == 0)
	{
		oneStep(i, j, me);
		if(me)//如果将落棋子为黑色
		{
			chessBoard[i][j] = 1;
		}
		else//如果将落棋子为白色
		{
			chessBoard[i][j] = 2;
		}
		me = !me;
	}
	
}