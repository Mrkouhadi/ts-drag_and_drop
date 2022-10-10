namespace App{
    // class ProjectInput
    export class ProjectInput extends Component<HTMLDivElement, HTMLElement>{
        titleInputElement: HTMLInputElement;
        descriptionInputElement: HTMLInputElement;
        peopleInputElement: HTMLInputElement;
        
        constructor(){
            super("project-input","app", true,"user-input");
            this.titleInputElement = <HTMLInputElement>this.element.querySelector("#title");
            this.descriptionInputElement = <HTMLInputElement>this.element.querySelector("#description");
            this.peopleInputElement = <HTMLInputElement>this.element.querySelector("#people");
            this.configure()
        };
        configure():void{
            this.element.addEventListener('submit', this.submitHandler) // without decorator; we would need: .bind(this)
        };
        renderContent(): void {
            
        };
        private clearInputs():void{
            this.titleInputElement.value = ""
            this.descriptionInputElement.value = ""
            this.peopleInputElement.value = ""
        };
        private gatherInputs():[string, string, number]{
            const TitleVal = this.titleInputElement.value;
            const descVal = this.descriptionInputElement.value;
            const peopleVal = +this.peopleInputElement.value;
            
            const titleValid : Ivalidatable = {
                value:TitleVal ,
                required:true,
                minLength:10,
                maxLength:40
            }
            const descValid:Ivalidatable = {
                value:descVal,
                required:true,
                minLength:10,
            }
            const peopleValid : Ivalidatable ={
                value: +peopleVal,
                required:true,
                min:1,
                max:10,
            }
            if( validate(titleValid) && validate(descValid) && validate(peopleValid)){
                return [TitleVal,descVal, peopleVal];
            }else {
                alert("error")
                throw new Error("fields are empty !")
            }
        };
        @AutoBinder //using a decorator to bind this method; alternative of: this.submitHandler.bind(this)
        private submitHandler(e:Event):void{
            e.preventDefault();
            const userInputs = this.gatherInputs();
            if(Array.isArray(userInputs)){
                const [title,desc, people] = userInputs;
                projectState.addProject(title, desc, people);
                this.clearInputs()
            }
        };
    };
}