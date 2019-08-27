# Restaurant ERP API

## Documentación del Message Broker

Se usa RabbitMq como message broker para este proyecto (https://www.rabbitmq.com/), que sirve como mecanismo de mensajería entre los distintos microservicios del restaurante.

El ERP actúa tanto como productor como consumidor. El archivo /rabbit/producer.js contiene todas las funciones que encolan mensajes al message broker.

### Mensajes relacionados con productos

#### Nuevo producto

* Nombre de la cola: new_product_queue
* Ejemplo de mensaje: ```{"date":"2019-08-20","description":"De chipilín","name":"Tamalito","price":5,"stock":45}```

#### Producto actualizado

* Nombre de la cola: updated_product_queue
* Ejemplo de mensaje: ```{"date":"2019-08-20","description":"De chipilín","name":"Tamalito","price":5,"stock":45}```

#### Producto eliminado

* Nombre de la cola: delete_product_queue
* Ejemplo de mensaje: ```{"id":"productId"}```

#### Cambio en existencia de un producto

* Nombre de la cola: update_stock_queue
* Ejemplo de mensaje: ```{"id":"productId","stock":11}```

### Mensajes relacionados con facturación

#### Nueva factura generada

* Nombre de la cola: new_receipt_queue
* Ejemplo de mensaje: ```{"address":"Ciudad","date_created":1566430918,id:"facturaId","name":"Jon Snow","nit":"319823-6","products":[{id:"productId","name":"Refresco Jamaica","price":"8.25","quantity":1},{{id:"productId","name":"Nachos","price":"5.75","quantity":2}
]}```

#### No se pudo generar factura, no alcanzan los ingredientes en existencia

* Nombre de la cola: out_of_stock_queue
* Ejemplo de mensaje: ```{"productId":"JGyMjYUoi1ierSYpbZLx","ingredientMissing":"Pan"}```

#### Factura eliminada

* Nombre de la cola: deleted_receipt_queue
* Ejemplo de mensaje: ```{"id":"facturaId"}```

### Mensajes relacionados con usuarios del sistema

#### Nuevo usuario creado

* Nombre de la cola: new_user_queue
* Ejemplo de mensaje: ```{"userId":"1fmmrx1d1QaWYKsP0vhglCNISjm2","userEmail":"bar15800@uvg.edu.gt","userName":"Rodrigo Barrios","userPermissions":["all-access"]}```

#### Usuario actualizado

* Nombre de la cola: update_user_queue
* Ejemplo de mensaje: ```{"userId":"1fmmrx1d1QaWYKsP0vhglCNISjm2","userEmail":"bar15800@uvg.edu.gt","userName":"Rodrigo Barrios","userPermissions":["all-access"]}```
