import {UserService} from '../rest/user';

export class UserEditController {
    private errorMsg;
    private userId:string;
    private firstName:string;
    private lastName:string;
    private email:string;
    private password:string;

    static $inject: Array<string> = [
        '$location',
        'UserService',
        '$routeParams',
    ];

    constructor(
        private $location: ng.ILocationService,
        private UserService: UserService,
        private routeParamsSvc: ng.route.IRouteParamsService) {
        this.userId =  this.routeParamsSvc['userid'];
        if(!this.userId){
            this.userId = UserService.getCurrentUser();
        }
        this.getUserByUserId(this.userId);
    }
   
    public getUserByUserId(userId):void{
        this.UserService.getUserByUserId(userId).then((user: any)=>{
            this.userId = user.Username;
            this.firstName = user.Username;
            this.lastName = user.Username;
            this.email = user.Email;
        });
    }

    public saveSettings():void {
        var setting = {
                email: this.email,
                password: this.password
        };
        this.UserService.saveUserSetting(this.userId,setting).then((result) => {
            if(result.status === 200){

            }
            else{
                alert("cannot update");
            }
        });
    }

    public save():void {
        var user = {
            username: this.userId,
            email: this.email,
            groups: [],
            role: "admin",
            password: this.password
        };
        this.UserService.editUser(this.userId,user).then((result) => {
            if(result.status === 200) {
                this.$location.path('/admin');
            }
        });
    }

    public cancel(): void {

        this.$location.path('/admin');
    }
}
