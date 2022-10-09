// class Project
enum EProjectStatus {active, completed}
class Project {
    constructor(public id:string, public title:string, public description:string, public people:number, public status:EProjectStatus){}
}

// Project State Management class
type Tlistner<T> = (items:T[])=>void;
class State<T>{
    protected listeners:Tlistner<T>[] = []
    addListeners(listenerFn:Tlistner<T>):void{
        this.listeners = [...this.listeners, listenerFn]
    }
}
class ProjectStateManager extends State<Project> {
    private projects: Project[] = [];
    private static instance:ProjectStateManager;

    private constructor(){
        super();
    }

    static getInstance(){
        if(this.instance) return this.instance
        this.instance = new ProjectStateManager();
        return this.instance;
    }

 
    addProject(title:string, description:string, numOfPeople:number):void{
        const newProject = new Project(new Date().toString(), title, description, numOfPeople, EProjectStatus.active)
        this.projects = [...this.projects, newProject];

        for(const listenerFn of this.listeners){
            listenerFn(this.projects.slice()); // return a copy using slice();
        }
    }
}
const projectState = ProjectStateManager.getInstance(); // this approach makes sure we always have one instance of this class for the whole project

// interface of Validatable
interface Ivalidatable {
    value: string | number;
    required?:boolean;
    maxLength?:number
    minLength?:number
    min?:number;
    max?:number;
}

// validation function that helps validate the inputs
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


// component Base class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement:HTMLTemplateElement;
    hostElement: T;
    element:U;
    constructor(templateID:string, hostElementId:string, insertAtstart:boolean, newElementId?:string ){
        this.templateElement = document.getElementById(templateID) as HTMLTemplateElement;
        this.hostElement = <T>document.getElementById(hostElementId);

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = <U>importedNode.firstElementChild;
        if(newElementId) this.element.id = newElementId;

        this.attach(insertAtstart)
    }
    private attach(insert:boolean):void{
        const position:InsertPosition = insert ? "afterbegin" : 'beforeend';
        this.hostElement.insertAdjacentElement(position, this.element)
    }
    abstract configure():void;
    abstract renderContent():void;
}
// ProjectItem class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>{
    private project: Project;
    constructor( hostId:string,project:Project ){
        super("single-project",hostId, false, project.id);
        this.project = project;
    }
}
// class Project list
class ProjectList extends Component<HTMLDivElement, HTMLElement>{
    assignedProjects: Project[];

    constructor(private type: "completed" | "active"){
        super("project-list","app",false,`${type}-projects` );

        this.assignedProjects = [];
        this.configure();
        this.renderContent()
    }

    configure(): void {
        const newAddedFuncToListeners = (projects:Project[])=>{
            const relevantProjects = projects.filter(proj => {
                if(this.type === 'active') return proj.status === EProjectStatus.active
                return proj.status === EProjectStatus.completed
            })
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        }
        projectState.addListeners(newAddedFuncToListeners);
    }
    renderContent():void{
        this.element.querySelector("ul")!.id = `${this.type}-projects-list`;
        this.element.querySelector("h2")!.textContent = `${this.type.toUpperCase()} PROJECTS`
    }
    private renderProjects():void{
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listEl.innerHTML = ""
        for(const proj of this.assignedProjects){
            const listItem = document.createElement("li");
            listItem.textContent = proj.title;
            listEl.appendChild(listItem);
        }
    }
}

// class ProjectInput
class ProjectInput extends Component<HTMLDivElement, HTMLElement>{
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
    
    constructor(){
        super("project-input","app", true,"user-input");
        this.titleInputElement = <HTMLInputElement>this.element.querySelector("#title");
        this.descriptionInputElement = <HTMLInputElement>this.element.querySelector("#description");
        this.peopleInputElement = <HTMLInputElement>this.element.querySelector("#people");

        this.configure()
    }
    configure():void{
        this.element.addEventListener('submit', this.submitHandler) // without decorator; we would need: .bind(this)
    }
    renderContent(): void {
        
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
            projectState.addProject(title, desc, people);
            this.clearInputs()
        }
    }
}
const completedProjects = new ProjectList('completed');
const activeProjects = new ProjectList('active');
const projectForm = new ProjectInput();