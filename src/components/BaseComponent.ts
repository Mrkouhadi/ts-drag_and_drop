namespace App {
        // component Base class
        export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
}