namespace App{
        // class Project list
       export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements IDragTarget{
            assignedProjects: Project[];
            constructor(private type: "completed" | "active"){
                super("project-list","app",false,`${type}-projects` );
                this.assignedProjects = [];
                this.configure();
                this.renderContent()
            };
            @AutoBinder
            dragOverHandler(event: DragEvent):void{
                if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){
                    event.preventDefault()
                    const listEl = this.element.querySelector("ul")!;
                    listEl.classList.add("droppable");
                }
            };
            @AutoBinder
            dropHandler(event: DragEvent):void{
                const draggedProjID = event.dataTransfer!.getData('text/plain');
                projectState.moveProject(draggedProjID, this.type === "active" ? EProjectStatus.active : EProjectStatus.completed);
            };
            @AutoBinder
            dragLeaveHandler(event: DragEvent):void{
                const listEl = this.element.querySelector("ul")!;
                listEl.classList.remove("droppable");
            };
            configure(): void {
                this.element.addEventListener("dragover", this.dragOverHandler);
                this.element.addEventListener("drop", this.dropHandler);
                this.element.addEventListener("dragleave", this.dragLeaveHandler);
                const newAddedFuncToListeners = (projects:Project[])=>{
                    const relevantProjects = projects.filter(proj => {
                        if(this.type === 'active') return proj.status === EProjectStatus.active
                        return proj.status === EProjectStatus.completed
                    });
                    this.assignedProjects = relevantProjects;
                    this.renderProjects();
                };
                projectState.addListeners(newAddedFuncToListeners);
            };
            renderContent():void{
                this.element.querySelector("ul")!.id = `${this.type}-projects-list`;
                this.element.querySelector("h2")!.textContent = `${this.type.toUpperCase()} PROJECTS`
            };
            private renderProjects():void{
                const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
                listEl.innerHTML = ""
                for(const proj of this.assignedProjects){
                    new ProjectItem(`${this.type}-projects-list`, proj)
                }
            };
        };
}