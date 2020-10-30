function fooBar(num){
    for (int i = 0; i <= num; i++){
        if (i % 3 == 0 && i % 5 == 0){
            print('FooBar');
        }
        else if (i % 3 == 0) {
            print('Foo');
        }
        else if (i % 5 == 0) {
            print('Bar');
        }
        else {
            print(i);
        }
    }
}