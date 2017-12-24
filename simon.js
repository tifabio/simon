// title: Simon
// author: Fabio Lorentz
// desc: Simon game javascript TIC-80
// script: js

var buttons = {
	colors : {
		green : {spr:0, x:100, y:90, key: 4}, //A
		red   : {spr:2, x:135, y:55, key: 5}, //B
		blue  : {spr:4, x:65,  y:55, key: 6}, //X
		yellow: {spr:6, x:100, y:17, key: 7}, //Y
	},
	scale : 4,
	colorkey: -1,

	draw: function() {
		for(var color in this.colors) {
			spr(this.colors[color].spr, this.colors[color].x, this.colors[color].y, this.colorkey, this.scale);
		}
	},

	press: function(color) {
		spr(this.colors[color].spr+1, this.colors[color].x, this.colors[color].y, this.colorkey, this.scale);
	}
}

var game = {
	colors: ['green','red','blue','yellow'],
	player_seq: [],
	cpu_seq: [],
	cpu_turn: false,
	lose: false,
	sleep: time(),
	score: 0,
	best: 0,
	next: 0,

	reset: function() {
		this.lose = false;
		this.score = 0;
		this.player_seq = [];
	},

	draw: function() {
		print("Score: " + this.score, 2, 5);
		print("Best: " + this.best, 2, 15);
		if(this.cpu_seq.length == 0 || this.lose) {
			print("Press any key to start", 60, 5);
		}
		if(this.lose) {
			print("GAME OVER", 2, 25);			
		}
		if(this.cpu_turn) {
			print("CPU TURN", 2, 25);			
		}
		buttons.draw();
	},

	checkBtnPress: function() {
		for(var color in buttons.colors) {
			if(btnp(buttons.colors[color].key)) {
				if(this.cpu_seq.length == 0) {
					this.reset();
				}
				if(this.cpu_seq.length > 0) {
					this.player_seq.push(color);
				}
				if(this.cpu_seq.length == this.player_seq.length) {
					if(this.cpu_seq.length > 0) {
						this.score++;
					}
					this.nextColor();
					this.cpu_turn = true;
					this.sleep = time();
					this.next = 0;
				}
				buttons.press(color);
				return;
			}
		}
	},

	checkPlayerMove: function() {
		var move = (this.player_seq.length - 1);
		if(this.cpu_seq[move] != this.player_seq[move]) {
			this.gameOver();
		}
	},

	drawNextColor() {
		if(this.cpu_seq.length > this.next) {
			buttons.press(this.cpu_seq[this.next]);
			this.next++;
		} else {
			this.cpu_turn = false;
			this.player_seq = [];
		}
	},

	nextColor: function() {
		var min = 0;
		var max = 3;
		var rand = Math.floor(Math.random() * (max - min + 1)) + min;
		var color = this.colors[rand];
		this.cpu_seq.push(color);
	},

	gameOver: function() {
		this.best = (this.score > this.best) ? this.score : this.best;
		this.lose = true;
		this.cpu_turn = false;
		this.cpu_seq = [];
	}
}

function TIC()
{
	cls(0);
	game.draw();
	if(!game.cpu_turn) {
		game.checkBtnPress();
		game.checkPlayerMove();
	}
	if(game.cpu_turn && (time() - game.sleep > 700)) { //0.7 second
		game.drawNextColor();
		game.sleep = time();
	}
}