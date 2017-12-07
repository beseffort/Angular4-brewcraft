import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { GuildService , Guild } from '../../../services';
import { NgForm } from '@angular/forms';
declare var $ : any;

@Component({
  selector: 'app-new-guild',
  templateUrl: './new-guild.component.html',
  styleUrls: ['./../guild.component.css']
})

export class NewGuildComponent implements OnInit {
  @ViewChild('guildname') guildname : ElementRef;
  @ViewChild('description') desc : ElementRef;
  @ViewChild('logoUrl') logoUrl : ElementRef;
  @ViewChild('logoFullUrl') logoFullUrl : ElementRef;
  constructor(private guildService : GuildService, public router: Router){
    
  }
  
  ngOnInit(){
    //this.loadScript();
    this.runCarousel();
  }
  
  submitNewGuild(guildname , desc, logoUrl , logoFullUrl){
    if(guildname == ''){
      alert('Please add guild name.');
      return false;
    }else if(logoUrl == ''){
      alert('Please choose avtar.');
      return false;
    }
    document.body.classList.add("loader");
    this.guildService.saveNewGuild(guildname , desc, logoUrl, logoFullUrl)
    .then(res => {
      document.body.classList.remove("loader");
      $.growl.notice({title:"Success", message: res.message,size:'large',duration:7000});
      // clear the fields 
      this.guildname.nativeElement.value = '';
      this.desc.nativeElement.value = '';
      this.logoUrl.nativeElement.value = '';
      this.logoFullUrl.nativeElement.value = '';
      $('#logo_name').text('');
      this.router.navigate(['/dashboard/guild/guilds/'+res.data]);
    });
  }
  
  closeModal(){
    var logo_url = $('ul .sc-selected img').attr('src');
    var logo_full_url = $('ul .sc-selected img').attr('data-src');
    var logo_name = $('.sc-content-wrapper h2').text();
    $('#logo_name').text(logo_name);
    $('#logo_url').val(logo_url);
    $('#logo_full_url').val(logo_full_url);
    $('#newGuild').modal('hide');
  }
  
  public loadScript() {
        //console.log('preparing to load...')
        let node = document.createElement('script');
        node.src = 'assets/carousel/jquery.sky.carousel-1.0.2.min.js';
        node.type = 'text/javascript';
        node.async = true;
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);
    }
  
  runCarousel(){
    $('.sky-carousel').carousel({
      itemWidth: 326,
      itemHeight: 332,
      distance:50,
      selectedItemDistance: 35,
      selectedItemZoomFactor: 0.9,
      unselectedItemZoomFactor: 0.6,
      unselectedItemAlpha: 0.6,
      motionStartDistance: 50,
      topMargin: 30,
      selectByClick: true
    });
  }
}