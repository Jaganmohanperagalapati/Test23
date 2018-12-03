import { CardPaginationComponent } from '../card-pagination/card-pagination.component';
import { SplitButtonsComponent } from '../split-buttons/split-buttons.component';
import { PaginationModule } from 'ngx-bootstrap';

 <div class="d-none d-md-block">
        <div class="d-flex">
          <div>Show</div>
          <div class="dropdown">
            <button class="dropdown-toggle" type="button" id="card-list-amount" data-toggle="dropdown" aria-haspopup="true"
              aria-expanded="false">
             {{curPageSize.Value}}
            </button>
            <div class="dropdown-menu" aria-labelledby="card-list-amount" >
              <a class="dropdown-item"  *ngFor="let page of lPageSizes" #selectElem (click)="setPageSize(page.id)">  {{page.Value}} </a>
              <!-- <a class="dropdown-item" href="#">48</a> -->
            </div>
          </div>
          <div> of {{searchResult?.data.length}} listings</div>
        </div>
      </div>
