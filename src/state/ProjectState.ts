namespace App{
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
            const newProject = new Project(new Date().valueOf().toString(), title, description, numOfPeople, EProjectStatus.active)
            this.projects = [...this.projects, newProject];
            this.updateListners();
        }
        moveProject(projId:string, newStatus:EProjectStatus):void{
            const exist = this.projects.find(proj => proj.id === projId);
            if(exist && exist.status !== newStatus) {
                exist.status = newStatus;
                this.updateListners();
            }
        }
        private updateListners():void{
            for(const listenerFn of this.listeners){
                listenerFn(this.projects.slice()); // return a copy using slice();
            }
        }
    }
    export const projectState = ProjectStateManager.getInstance(); // this approach makes sure we always have one instance of this class for the whole project   
}