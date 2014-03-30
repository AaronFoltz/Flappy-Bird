// Creates a new 'main' state that wil contain the game
var play_state = {
    create: function() {
    	// Fuction called after 'preload' to setup the game
        // Display the bird on the screen
        this.bird = this.game.add.sprite(100, 245, 'bird');

        // Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 1000;

        // Anchor point for the animation
        this.bird.anchor.setTo(-0.2, 0.5);

        this.pipes = game.add.group();
        this.pipes.createMultiple(20, 'pipe');

        // Call the 'jump' function when the spacekey is hit
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this);

        // timer for the pipes
        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);

        // score
        score = 0;
        var style = { font: "30px Arial", fill: "#ffffff" };
        this.label_score = this.game.add.text(20, 20, "0", style);

        // sound
        this.jump_sound = this.game.add.audio('jump');
    },

    update: function() {
		// Function called 60 times per second
        // If the bird is out of the world (too high or too low), call the 'restart_game' function
        if (this.bird.inWorld == false)
        {
            this.restart_game();
        }

        this.game.physics.overlap(this.bird, this.pipes, this.hit_pipe, null, this);

        if (this.bird.angle < 20)
            this.bird.angle += 1;
    },

    // Make the bird jump
    jump: function() {
        if (this.bird.alive == false)
            return;

        this.jump_sound.play();

        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;

        // Rotate upward when jumping
        this.game.add.tween(this.bird).to({angle: -20}, 100).start();

    },

    // Restart the game
    restart_game: function() {
        // Remove the timer
        this.game.time.events.remove(this.timer);

        // Start the 'main' state, which restarts the game
        this.game.state.start('menu');
    },

    add_one_pipe: function(x, y) {
        // Get the first dead pipe of our group
        var pipe = this.pipes.getFirstDead();

        // Set the new position of the pipe
        pipe.reset(x, y);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200;

        // Kill the pipe when it's no longer visible
        pipe.outOfBoundsKill = true;
    },

    add_row_of_pipes: function() {
        var hole = Math.floor(Math.random()*5)+1;

        score += 1;
        this.label_score.content = score;

        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1)
                this.add_one_pipe(400, i*60+10);
    },

    hit_pipe: function() {
        // If the bird has already hit a pipe, we have nothing to do
        if (this.bird.alive == false)
            return;

        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        this.game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.pipes.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
    },
};