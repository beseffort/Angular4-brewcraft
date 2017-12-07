import { Directive , Input , ElementRef , Renderer , OnInit } from '@angular/core';
import { Router, NavigationEnd , ActivatedRoute } from '@angular/router';
declare var $ : any;

@Directive({
  selector: '[HashTagLink]'
})
export class HashTagLink {
  @Input()
  keywords:string;

  highlightClass: string = 'highlight';

  constructor(private elementRef:ElementRef,
    private renderer:Renderer,
    private router : Router
  ) {
    
  }
  
  ngOnInit(){
    setTimeout(() => {
      //console.log(this.elementRef.nativeElement.innerText);
      $(".context").markRegExp(/([@]|[#])([a-z])\w+/gmi, {
      	"element": "a",
        "className": "highlight",
      	"each": function(element){
        	$(element).attr("href", "javascript:;");
        }
      });
      
      // highlight redirect 
      var self = this;
      var guildID;
      $('.highlight').click(function(){
        var type = $(this).parent().attr('data-name');
        if(type == 'chat'){
          guildID = $(this).parent().attr('id');
        }else{
          guildID = 'none';
        }
        var string = $(this).text();
        var substring = string.substring(1, string.length);
        var first = string.substring(0, 1);
        if(first == '#'){
          self.router.navigate(['/dashboard/'+type+'/hashtag/'+substring+'/'+guildID])
        }
      });
    }, 100);
  }

}