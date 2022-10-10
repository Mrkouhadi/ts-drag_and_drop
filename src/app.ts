/// <reference path="models/interfaces.ts" />
/// <reference path="models/project-model.ts" />
/// <reference path="state/ProjectState.ts" />
/// <reference path="utils/Validation.ts"/>
/// <reference path="decorators/AutobindDecorator.ts"/>
/// <reference path="components/BaseComponent.ts"/>
/// <reference path="components/ProjectList.ts"/>
/// <reference path="components/ProjectInput.ts"/>
/// <reference path="components/ProjectItem.ts"/>

namespace App{
    new ProjectList('completed');
    new ProjectList('active');
    new ProjectInput();
}