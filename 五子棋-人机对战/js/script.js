//在F12 console控制台可以查看报错
var me = true;
var chessBoard = [];//每个点的占用情况，二维数组
var over=false;//over表示棋有没有结束，true表示结束，false表示没有结束
//定义赢法数组
var wins=[];
var count=0;//count表示赢法种类的索引，初始化为0
//定义赢法统计数组
var myWin=[];//我的
var computerWin=[];//计算机的
//赢法棋盘
for(var i=0;i<15;i++)//一共15行
{
	wins[i]=[];//定义一个每个元素都是数组的数组（二维，但第二维未定义）
	for(var j=0;j<15;j++)//每行一共有15个位置
	{
		wins[i][j]=[];//把二维数组拓展到三维（前两维表示棋盘）	
	}
}
//填充赢法数组：横向
for(var i=0;i<15;i++)
{
	for(var j=0;j<11;j++)
	{
		//wins[0][0][0]=true;
		//wins[0][1][0]=true;
		//wins[0][2][0]=true;
		//wins[0][3][0]=true;
		//wins[0][4][0]=true;

		//wins[0][1][1]=true;
		//wins[0][2][1]=true;
		//wins[0][3][1]=true;
		//wins[0][4][1]=true;
		//wins[0][5][1]=true;
		for(var k=0;k<5;k++)
		{
			wins[i][j+k][count]=true;
		}
		count++;
	}
}
//填充赢法数组：纵向
for(var i=0;i<15;i++)
{
	for(var j=0;j<11;j++)
	{
		for(var k=0;k<5;k++)
		{
			wins[j+k][i][count]=true;
		}
		count++;
	}
}
//填充赢法数组：斜线
for(var i=0;i<11;i++)//超出11*11范围不可能以斜线的方式赢
{
	for(var j=0;j<11;j++)
	{
		for(var k=0;k<5;k++)
		{
			wins[i+k][j+k][count]=true;
		}
		count++;
	}
}
//填充赢法数组：反斜线
for(var i=0;i<11;i++)
{
	for(var j=14;j>3;j--)
	{
		for(var k=0;k<5;k++)
		{
			wins[i+k][j-k][count]=true;
		}
		count++;
	}
}
console.log(count);

for(var i=0;i<count;i++)//把赢法统计数组都初始化为0
{
	myWin[i]=0;
	computerWin[i]=0;
}
//chessboard用来记录棋盘是否被占用
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
	if(over==true)
	{
		return;//如果结束了，直接return
	}
	if(!me)//让onclick函数只有在我方下棋的时候在有效。如果不是我方下棋，直接return
	{

	}
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
/*		else//如果将落棋子为白色
		{
			chessBoard[i][j] = 2;
		}
		me = !me;*/
		//我方落子的时候对赢法进行更新：
		//首先遍历所有的赢法
		for(var k=0;k<count;k++)
		{
			if(wins[i][j][k]==true)//在i，j的位置（刚落子的位置）有很多种赢法。如果第k种赢法在i，j位置是true的话（表示刚才的落子能和第k种赢法匹配）
			{
				myWin[k]++;//第k种赢法的棋子又多了一个
				computerWin[k]=6;//那么电脑在这种赢法上就不可能赢了，故设置为异常值6
				if(myWin[k]==5)//如果这种赢法已经有了5个子，则me赢了
				{
					window.alert("你赢了");
					over=true;
				}
			}
		}
		if(!over)//如果没有结束，调用computerAI函数
		{
			me = !me;//把下棋的权利交给计算机
			computerAI();
		}
	}	
}

var computerAI=function()//计算棋盘上所有点的得分
{
	var myScore=[];
	var computerScore=[];
	var max=0;//max用来保存最高的分数
	var u=0,v=0;//u,v用来保存最高分数点的坐标
	for(var i=0;i<15;i++)//把myScore[15][15]和computerScore[15][15]都初始化为0
	{
		myScore[i]=[];
		computerScore[i]=[];
		for(var j=0;j<15;j++)
		{
			myScore[i][j]=0;
			computerScore[i][j]=0;
		}
	}
	//遍历整个棋盘
	for(var i=0;i<15;i++)
	{
		for(var j=0;j<15;j++)
		{
			if(chessBoard[i][j]==0)//表示这个位置没有棋
			{
				for(var k=0;k<count;k++)
				{
					if(wins[i][j][k]==true)//表示这个位置对于第k种赢法是有价值的
					{
						//myScore每一个位置的得分情况
						if(myWin[k]==1)
						{
							myScore[i][j]=myScore[i][j]+200;
						}
						else if(myWin[k]==2)
						{
							myScore[i][j]=myScore[i][j]+400;
						}
						else if(myWin[k]==3)
						{
							myScore[i][j]=myScore[i][j]+2000;
						}
						else if(myWin[k]==4)
						{
							myScore[i][j]=myScore[i][j]+10000;
						}
						//computerScore每一个位置的得分情况：值比myscore大，偏向进攻
						if(computerWin[k]==1)
						{
							computerScore[i][j]=computerScore[i][j]+220;
						}
						else if(computerWin[k]==2)
						{
							computerScore[i][j]=computerScore[i][j]+420;
						}
						else if(computerWin[k]==3)
						{
							computerScore[i][j]=computerScore[i][j]+2100;
						}
						else if(computerWin[k]==4)
						{
							computerScore[i][j]=computerScore[i][j]+20000;
						}
					}	
				}
				//myscore的最大
				if(myScore[i][j]>max)
				{
					max=myScore[i][j];//记录值和对应的坐标
					u=i;
					v=j;
				}
				else if(myScore[i][j]==max)
				{
					if(computerScore[i][j]>computerScore[u][v])//新的比之前的好
					{
						u=i;
						v=j;
					}
				}
				//computerscore的最大
				if(computerScore[i][j]>max)
				{
					max=computerScore[i][j];//记录值和对应的坐标
					u=i;
					v=j;
				}
				else if(computerScore[i][j]==max)
				{
					if(myScore[i][j]>myScore[u][v])//新的比之前的好
					{
						u=i;
						v=j;
					}
				}
				//以上：最终得到的u，v是myscore和computerscore里面分数最高的一个点
			}
		}
	}
	oneStep(u,v,false);
	chessBoard[u][v]=2;
//-------------------------------------------debug---------------------------------------------
for(var i=0;i<15;i++)
{
	for(var j=0;j<15;j++)
	{
		console.log(i+" "+j+" "+myScore[i][j]);
	}
}
console.log("最大分值为"+myScore[u][v]);
//-------------------------------------------debug---------------------------------------------
	//以下更新赢法统计数组
	for(var k=0;k<count;k++)
		{
			if(wins[u][v][k]==true)//在i，j的位置（刚落子的位置）有很多种赢法。如果第k种赢法在i，j位置是true的话（表示刚才的落子能和第k种赢法匹配）
			{
				computerWin[k]++;//第k种赢法的棋子又多了一个
				myWin[k]=6;//那么电脑在这种赢法上就不可能赢了，故设置为异常值6
				if(computerWin[k]==5)//如果这种赢法已经有了5个子，则me赢了
				{
					window.alert("计算机赢了");
					over=true;
				}
			}
		}
		if(!over)//如果没有结束，调用computerAI函数
		{
			me = !me;//把下棋的权利翻转
		}
}
