function Cell(i, j, w) {
    this.i = i;
    this.j = j;
    this.w = w;
    this.x = i * w;
    this.y = j * w;
    this.neighborCount = 0;
    this.revealed = false;
    this.mine = false;
    this.marked = false;
}

Cell.prototype.show = function() {
    stroke(0);
    fill(0, 234, 163);
    rect(this.x, this.y, this.w, this.w);

    if (this.revealed) {
        if (this.mine) {
            image(images.mine, this.x, this. y, this.w, this.w);
        } else {
            fill(255);
            rect(this.x, this.y, this.w, this.w);
            if (this.neighborCount > 0) {
                textAlign(CENTER);
                fill(0);
                textSize(12);
                textFont("Arial");
                text(this.neighborCount, this.x + this.w * 0.5, this.y + this.w - 6);
            }
        }
    } else if (this.marked) {
		image(images.flag, this.x, this.y, this.w, this.w);
    }
}

Cell.prototype.bombsCount = function() {
    if (this.mine) {
        this.neighborCount = -1;
        return;
    }
    let total = 0;
    for (let xoff = -1; xoff <= 1; xoff++) {
        for ( let yoff = -1; yoff <= 1; yoff++) {
            let i = this.i + xoff;
            let j = this.j + yoff

            if (i > -1 && i < cols && j > -1 && j < rows) {
                let neighbor = grid[i][j];
                if (neighbor.mine) {
                    total++;
                }
            }
        }
    }
    this.neighborCount = total;
}

Cell.prototype.contains = function(x, y) {
    return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w);
}

Cell.prototype.reveal = function() {
    this.revealed = true;

    if (this.neighborCount == 0) {
        this.floodFill();
    }
}

Cell.prototype.floodFill = function() {
    for (let xoff = -1; xoff <= 1; xoff++) {
        for ( let yoff = -1; yoff <= 1; yoff++) {
            let i = this.i + xoff;
            let j = this.j + yoff

            if (i > -1 && i < cols && j > -1 && j < rows) {
                let neighbor = grid[i][j];
                if (!neighbor.mine && !neighbor.revealed) {
                    neighbor.reveal();
                }
            }
        }
    }
}
