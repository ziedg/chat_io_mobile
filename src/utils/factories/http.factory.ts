import {Http, RequestOptions, XHRBackend} from '@angular/http';
import {HttpClient} from "../http-client";
import {Injector} from '@angular/core';



export function httpFactory (xhrBackend: XHRBackend, requestOptions: RequestOptions, injector: Injector)
{
  return new HttpClient(xhrBackend, requestOptions, injector);
}
