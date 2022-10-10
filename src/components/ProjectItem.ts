namespace App {
       // ProjectItem class
       export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Idraggable{
        private project: Project;
        
        get persons(){
            return this.project.people > 1 ? `${this.project.people} Persons are Assigned` : "1 Person is Assigned";
        }
        constructor( hostId:string, project:Project ){
            super("single-project", hostId, false, project.id);
            this.project = project;
            this.configure()
            this.renderContent();
        }
        @AutoBinder
        dragStartHandler(event: DragEvent):void{
            event.dataTransfer!.setData('text/plain', this.project.id);
            event.dataTransfer!.effectAllowed = 'move';
        }
        dragEndHandler(event:DragEvent):void{
            console.log("End dragging: ", event);
        }
        configure(): void {
            this.element.addEventListener("dragstart", this.dragStartHandler);
            this.element.addEventListener("dragend", this.dragEndHandler);
        }
        renderContent(): void {
            this.element.querySelector("h2")!.textContent = "Title: "+this.project.title;
            this.element.querySelector("h3")!.textContent = "Members: "+this.persons;
            this.element.querySelector("p")!.textContent = "Description: "+this.project.description;
        }
    }

}