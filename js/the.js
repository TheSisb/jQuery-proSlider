// My first jquery plugin to create slider input ranges
(function($){
    $.fn.proSlider = function() {
	
	function sliderObj(min, max, step, value, classes, el) {
	    // Basic vars
	    this.min = min;
	    this.max = max;
	    this.step = step;
	    this.value = value;
	    this.classes = classes;
	    this.el = el;
	    this.bulb;
	    
	    // Validate + HTML manip
	    if (!this.validate())
		return false;
	    this.addMarkup();
	    
	    // Set new vars
	    this.width = this.el.prev('.sliderLine').width() - 30, // width
	    this.slice = this.width / ( (this.max - this.min) / this.step );
			
	    if (this.value != this.min || this.value != "" || this.value !== undefined)
			this.bulb.css('left', (((this.value - this.min) / this.step ) * this.slice ) );

	    // Do the binding
	    this.bindToSelf( this );
	    return true;
	}
	
	sliderObj.prototype.validate = function() {
	    if(this.el.attr('type') != 'range') 
			return false; // Not an input[type=range]
	    if (this.step === 0) 
			return false; // Division by 0
	    if (((this.max - this.min) % this.step) !== 0) 
			return false; // Steps aren't flush
	    if ( this.value > this.max || this.value < this.min )
			return false; // value not in range
			
	    return true;
	}
	    
    sliderObj.prototype.addMarkup = function() {
	    //Add slider markup
	    this.el.hide();
	    this.el.before("<div class='sliderLine " + this.classes + "'><div class='sliderBulb'>"+this.value+"</div></div>");
	    this.bulb = this.el.prev('.sliderLine').children('.sliderBulb');
	}
	    
	sliderObj.prototype.bindToSelf = function( self ) { 
	    // Bind the event
	    this.bulb.bind('mousedown', function() {
	    	var $this = $(this);

			$(document).bind("mousemove.nsA", function(e){ 
				var val = (e.pageX-90/2);
				
				if (val < 0 || val > self.width) 
					return;	   
				 
				$this.css('left',val);

				// Calculate the input value based on bulb position
				val = self.min + (Math.round(val / self.slice) * self.step);
				$this.text(val);
				$this.next('input').val(val);
				
			}); 
			$(document).bind('mouseup', function(){
				$(document).unbind("mousemove.nsA");
			});
	    });
	}

	    
	return this.each(function() {
	   // Create slider object
	   new sliderObj(
				parseInt($(this).attr('min'),10),
				parseInt($(this).attr('max'),10),
				parseInt($(this).attr('step'),10),
				parseInt($(this).attr('value'),10),
				$(this).attr("class").slice(7),
				$(this)
		            );
        });
    };
    
})(jQuery);

// Call it, playboy
$('.slider').proSlider();

