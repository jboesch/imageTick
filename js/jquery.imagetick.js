/*
* Image Tick for jQuery
* http://boedesign.com/blog/2008/06/08/imagetick-for-jquery/
*
* Copyright (c) 2010 Jordan Boesch
* Dual licensed under the MIT and GPL licenses.
*
* Date: September 27, 2010
* Version: 2.0
*/

(function($){
		  
    $.fn.imageTick = function(options) {
		
        var defaults = {	
            tick_image_path: "images/radio.gif",
            no_tick_image_path: "no_images/radio.gif",
            image_tick_class: "ticks_" + Math.floor(Math.random() * 999999),
            hide_radios_checkboxes: true,
            tick_img_id_format: 'tick_img_%s',
            logging: false,
            img_html: '<img src="%s1" alt="no_tick" class="%s2" id="tick_img_%s3" />',
            _valid_types: ['checkbox', 'radio']
        };
        	
        var opt = $.extend(defaults, options);
		
        /*
        * When we click on the image, we need to compare images to see if we're
        * on a checked state or a non-checked state, IE needs this cause it handles
        * image paths as absolute urls. Here we just strip off the file name and use that.
        *
        * @param e {DOMElement} The DOM element of the image we just clicked on
        */
        function getImagePath(e){
            
            var current_img_src = e.src.split('/').pop();
            var no_tick_path = opt.no_tick_image_path.split('/').pop();
        	
            return [current_img_src, no_tick_path];
            
        }
		
        /*
        * When the user clicks on the radio/checkbox image, they are taken to this function to
        * determine what to do with the cooresponding labels and inputs
        *
        * @param type {String} Is it a 'checkbox' or a 'radio'
        * @param $input_id {jQuery Object} The id of the real <input>
        * @param coming_from_label {Boolean} If we've clicked on the label and we're being sent here
        */
        function handleClickType(type, $input_id, coming_from_label){
            
            $input_id.trigger("click");
            
            if(type == 'checkbox'){
                var img_parts = getImagePath(this);
                var img_src = (img_parts[0] == img_parts[1]) ? opt.tick_image_path : opt.no_tick_image_path;
            }
            else {
                $("." + opt.image_tick_class).attr('src', opt.no_tick_image_path);
                var img_src = opt.tick_image_path;
            }
			
            this.src = img_src;
		  
        }
		
        // Loop through each one of our elements
        this.each(function(){
			
            var $obj = $(this);
            var type = $obj[0].type; // radio or checkbox
			
            if($.inArray(type, opt._valid_types) == -1){
                return;
            }
			
            var id = $obj[0].id;
            var $input_id = $('#' + id);
            var imgHTML = opt.img_html.replace('%s1', opt.no_tick_image_path).replace('%s2', opt.image_tick_class).replace('%s3', id);
			
            $obj.before(imgHTML);
			
            var $img_id = $('#' + opt.tick_img_id_format.replace('%s', id));
			
            if(opt.hide_radios_checkboxes){
                $obj.css('display','none');
            }
			
            // If something has a checked state when the page was loaded
            if($obj[0].checked){
                $img_id[0].src = opt.tick_image_path;
            }
            
            // Delegate the click off to a function that will determine what to do with
            // it based on if it's a checkbox or a radio button
            $img_id.click(function(e, coming_from_label){
                handleClickType.call(this, type, $input_id, coming_from_label);
            });
			
            // Handle clicks for the labels
            $("label[for='" + id + "']").click(function(e){
                e.preventDefault();	
                // Pass a boolean true to say we're coming from the label
                $img_id.trigger('click', true);
            });
			
        });
    };
	
})(jQuery);
