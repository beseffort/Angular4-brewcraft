import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService, User, AuthService } from '../../../../services';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
declare var $: any;

@Component({
  selector: 'app-profile-widget',
  templateUrl: './profile-widget.component.html',
  styleUrls: ['./profile-widget.component.css']
})
export class ProfileWidgetComponent implements OnInit {

  user: User;
  tempUser: User;
  joinDate: String;
  uploadPhoto: boolean = false;

  yourModelDate: Date;

  tempPhoto: any;
  imageError: any;
  resizeOptions: ResizeOptions = {
    resizeMaxHeight: 600,
    resizeMaxWidth: 600
  };

  data2: any;
  cropperSettings2: CropperSettings;
  croppedWidth: number;
  croppedHeight: number;
  errorMsg: string = '';

  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;

  constructor(private sharedService: SharedService, private authService: AuthService) {
    this.cropperSettings2 = new CropperSettings();
    this.cropperSettings2.width = 200;
    this.cropperSettings2.height = 200;
    this.cropperSettings2.keepAspect = false;

    this.cropperSettings2.croppedWidth = 200;
    this.cropperSettings2.croppedHeight = 200;

    this.cropperSettings2.canvasWidth = 380;
    this.cropperSettings2.canvasHeight = 300;
    this.cropperSettings2.minWidth = 100;
    this.cropperSettings2.minHeight = 100;

    this.cropperSettings2.rounded = true;
    this.cropperSettings2.minWithRelativeToResolution = false;

    this.cropperSettings2.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings2.cropperDrawSettings.strokeWidth = 2;
    this.cropperSettings2.noFileInput = true;
    this.data2 = {};
    this.data2.image = '';
  }

  ngOnInit() {
    this.user = this.sharedService.getUser();
    this.tempUser = this.sharedService.getUser();
    if (this.tempUser.birthday != undefined)
      this.tempUser.birthday = new Date(this.tempUser.birthday);
    var date = new Date(this.user.joinDate);
    this.joinDate = date.getFullYear().toString();
    this.data2.image = this.user.photoUrl;
  }

  openProfileDialog() {
    $('#profile-box').modal();
  }

  saveProfile() {
    this.authService.updateProfile(this.tempUser)
      .then(res => {
        $('#profile-box').modal('toggle');
        this.sharedService.setUser(this.tempUser);
        this.user = this.sharedService.getUser();
      });
  }

  selected(imageResult: ImageResult) {
    this.tempPhoto = imageResult.resized
      && imageResult.resized.dataURL
      || imageResult.dataURL;
    this.imageError = null;
    if (imageResult.error) {
      this.imageError = "Only jpg, png, jpeg files are supported";
      return;
    }
  }

  cropped(bounds: Bounds) {
    this.croppedHeight = bounds.bottom - bounds.top;
    this.croppedWidth = bounds.right - bounds.left;
  }
  fileChangeListener($event) {
    var image: any = new Image();
    var file: File = $event.target.files[0];
    var myReader: FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);

    };

    myReader.readAsDataURL(file);
  }
  cancelUploadPhoto() {
    this.uploadPhoto = false;
    this.data2.image = '';
  }
  closeProfileBox() {
    this.uploadPhoto = false;
    this.data2.image = '';
    $('#profile-box').modal('toggle');
  }
  imageSave() {
    this.errorMsg = '';
    if (this.data2.image == '') {
      this.errorMsg = 'Please choose image';
      return;
    }
    this.authService.updatePhoto(this.data2.image)
      .then(res => {
        this.uploadPhoto = false;
        this.data2.image = '';
        this.user.photoUrl = res.data;
        this.tempUser.photoUrl = res.data;
        console.log(this.user.photoUrl);
        this.sharedService.setUser(this.user);
      });
  }
}
