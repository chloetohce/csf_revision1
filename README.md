# Revision Notes

## Component Store
> When should you use a component store?
We can use a service, and call `.next()`, and correspondingly get an observable or call `subscribe()`. If you ever find that you are passing data through a service, especially in scenarios where a lot of data is passed, it is recommended to implement a state management library. 

You should use a store if you are using and calling the data multiple times. There may be a chance the data might be different, especially if data changes a lot. 

## PWA
Go to [PWA factory](pwa-factory.com) to generate manifest. 


Copy everything that is generated into the public folder.


Modify the `manifest.json` file, and add the following lines as needed. 

```json
  "id": "/"

"shortcuts" :[
    {
        "name": "Option A",
        "short_name": "opta",
        "url": "/"
    }
  ]
```

***IMPORTANT***: add the following line to the index.html file to ensure the manifest is loaded. 
```html
  <link rel="manifest" href="/manifest.json">
```