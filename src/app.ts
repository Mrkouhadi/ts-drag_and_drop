
interface Ivalidatable {
    value: string | number;
    required?:boolean;
    maxLength?:number
    minLength?:number
    min?:number;
    max?:number;
}

const validate=(validatableInput:Ivalidatable):boolean=>{
    let isValid = true;
    if(validatableInput.required){
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if(validatableInput.minLength != null && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength
    }
    if(validatableInput.maxLength != null && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength
    }
    if(validatableInput.min != null && typeof validatableInput.value === 'number'){
        isValid = isValid && validatableInput.value >= validatableInput.min
    }
    if(validatableInput.max != null && typeof validatableInput.value === 'number'){
        isValid = isValid && validatableInput.value <= validatableInput.max
    }
    return isValid;
}
// a decorator that helps us auto bind methods
const AutoBinder=(target:any, methodName: string | Symbol, descriptor: PropertyDescriptor):PropertyDescriptor => {
    const originalMethod = descriptor.value;
    return {
        configurable:true, // so that we can always change it
        enumerable:false,
        get(){
            return originalMethod.bind(this); // " this " refers whatever is triggering this method
        }
    }
}

// // class Project list
class ProjectList{
    templateElement:HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element:HTMLElement;
    constructor(private type: "completed" | "active"){
        this.templateElement = document.getElementById("project-list") as HTMLTemplateElement;
        this.hostElement = <HTMLDivElement>document.getElementById("app");
        const importedNode = document.importNode(this.templateElement.content, true);

        this.element = <HTMLElement>importedNode.firstElementChild;

        this.attach()
        this.renderContent()
    }
    private renderContent():void{
        const listId = `${this.type}-projects`;
        this.element.querySelector("ul")!.id = listId;
        this.element.querySelector("h2")!.textContent = `${this.type.toUpperCase()} PROJECTS`
    }
    private attach():void{
        this.hostElement.insertAdjacentElement('beforeend', this.element)
    }
}

// class ProjectInput
class ProjectInput{
    templateElement:HTMLTemplateElement;
    hostElement: HTMLDivElement;
    formElement: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
    
    constructor(){
        this.templateElement = document.getElementById("project-input") as HTMLTemplateElement;
        this.hostElement = <HTMLDivElement>document.getElementById("app");

        const importedNode = document.importNode(this.templateElement.content, true);
        this.formElement = importedNode.firstElementChild as HTMLFormElement;
        this.formElement.id = "user-input" // Add an id attribute to the Form

        this.titleInputElement = <HTMLInputElement>this.formElement.querySelector("#title");
        this.descriptionInputElement = <HTMLInputElement>this.formElement.querySelector("#description");
        this.peopleInputElement = <HTMLInputElement>this.formElement.querySelector("#people");

        this.configure()
        this.attach();
    }
    private clearInputs():void{
        this.titleInputElement.value = ""
        this.descriptionInputElement.value = ""
        this.peopleInputElement.value = ""
    }
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
    }
    @AutoBinder //using a decorator to bind this method; alternative of: this.submitHandler.bind(this)
    private submitHandler(e:Event):void{
        e.preventDefault();
        const userInputs = this.gatherInputs();
        if(Array.isArray(userInputs)){
            const [title,desc, people] = userInputs;
            console.log(title, desc, people);
            this.clearInputs()
        }
    }

    private configure():void{
        this.formElement.addEventListener('submit', this.submitHandler) // without decorator; we would need: .bind(this)
    }

    private attach():void{
        this.hostElement.insertAdjacentElement('afterbegin', this.formElement)
    }
}
const completedProjects = new ProjectList('completed');
const activeProjects = new ProjectList('active');
const projectForm = new ProjectInput();
