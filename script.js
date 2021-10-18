// min heap implementation
class MinHeap {
  constructor() {
    this.heap_array = [];
  }

  // returns size of the min heap
  size() {
    return this.heap_array.length;
  }

  // returns if the heap is empty
  empty() {
    return this.size() === 0;
  }

  // insert a new value in the heap
  push(value) {
    this.heap_array.push(value);
    this.up_heapify();
  }

  // updates heap by up heapifying
  up_heapify() {
    var current_index = this.size() - 1;
    while (current_index > 0) {
      var current_element = this.heap_array[current_index];
      var parent_index = Math.trunc((current_index - 1) / 2);
      var parent_element = this.heap_array[parent_index];

      if (parent_element[0] < current_element[0]) {
        break;
      } else {
        this.heap_array[parent_index] = current_element;
        this.heap_array[current_index] = parent_element;
        current_index = parent_index;
      }
    }
  }

  // returns the top element (smallest value element)
  top() {
    return this.heap_array[0];
  }

  // delete the top element
  pop() {
    if (this.empty() == false) {
      var last_index = this.size() - 1;
      this.heap_array[0] = this.heap_array[last_index];
      this.heap_array.pop();
      this.down_heapify();
    }
  }

  // updates heap by down heapifying
  down_heapify() {
    var current_index = 0;
    var current_element = this.heap_array[0];
    while (current_index < this.size()) {
      var child_index1 = current_index * 2 + 1;
      var child_index2 = current_index * 2 + 2;
      if (child_index1 >= this.size() && child_index2 >= this.size()) {
        break;
      } else if (child_index2 >= this.size()) {
        let child_element1 = this.heap_array[child_index1];
        if (current_element[0] < child_element1[0]) {
          break;
        } else {
          this.heap_array[child_index1] = current_element;
          this.heap_array[current_index] = child_element1;
          current_index = child_index1;
        }
      } else {
        var child_element1 = this.heap_array[child_index1];
        var child_element2 = this.heap_array[child_index2];
        if (
          current_element[0] < child_element1[0] &&
          current_element[0] < child_element2[0]
        ) {
          break;
        } else {
          if (child_element1[0] < child_element2[0]) {
            this.heap_array[child_index1] = current_element;
            this.heap_array[current_index] = child_element1;
            current_index = child_index1;
          } else {
            this.heap_array[child_index2] = current_element;
            this.heap_array[current_index] = child_element2;
            current_index = child_index2;
          }
        }
      }
    }
  }
}

// coder decoder class
class Codec {
  // dfs
  getCodes(node, curr_code) {
    // is leaf node
    if (typeof node[1] === 'string') {
      // alternate way
      this.codes[node[1]] = curr_code;
      return;
    }

    // go left
    this.getCodes(node[1][0], curr_code + '0');
    // go right
    this.getCodes(node[1][1], curr_code + '1');
  }

  // make the humffman tree into a string
  make_string(node) {
    if (typeof node[1] === 'string') {
      return "'" + node[1];
    }
    return (
      '0' + this.make_string(node[1][0]) + '1' + this.make_string(node[1][1])
    );
  }
  // make string into huffman tree
  make_tree(tree_string) {
    let node = [];
    if (tree_string[this.index] === "'") {
      this.index++;
      node.push(tree_string[this.index]);
      this.index++;
      return node;
    }
    this.index++;
    node.push(this.make_tree(tree_string)); // find and push left child
    this.index++;
    node.push(this.make_tree(tree_string)); // find and push right child
    return node;
  }

  // encoder function
  encode(data) {
    this.heap = new MinHeap();

    var mp = new Map();
    for (let i = 0; i < data.length; i++) {
      if (mp.has(data[i])) {
        let foo = mp.get(data[i]);
        mp.set(data[i], foo + 1);
      } else {
        mp.set(data[i], 1);
      }
    }
    if (mp.size === 0) {
      let final_string = 'zer#';

      let output_message = 'Compression complete and file sent for download!';
      let ratio =
        'Compression Ratio : ' +
        (data.length / final_string.length).toPrecision(5);
      return [final_string, output_message, ratio];
    }

    if (mp.size === 1) {
      let key, value;
      for (let [k, v] of mp) {
        key = k;
        value = v;
      }
      let final_string = 'one' + '#' + key + '#' + value.toString();
      let output_message = 'Compression complete and file sent for download!';
      let ratio =
        'Compression Ratio : ' +
        (data.length / final_string.length).toPrecision(5);
      return [final_string, output_message, ratio];
    }
    for (let [key, value] of mp) {
      this.heap.push([value, key]);
    }

    // alternate way
    // mp.forEach(function (value, key) {
    //     console.log([value, key]);
    // })
    while (this.heap.size() >= 2) {
      let min_node1 = this.heap.top();
      this.heap.pop();
      let min_node2 = this.heap.top();
      this.heap.pop();
      this.heap.push([min_node1[0] + min_node2[0], [min_node1, min_node2]]);
    }
    var huffman_tree = this.heap.top();
    this.heap.pop();
    this.codes = {};
    this.getCodes(huffman_tree, '');

    // convert data into coded data
    let binary_string = '';
    for (let i = 0; i < data.length; i++) {
      binary_string += this.codes[data[i]];
    }
    let padding_length = (8 - (binary_string.length % 8)) % 8;
    for (let i = 0; i < padding_length; i++) {
      binary_string += '0';
    }
    let encoded_data = '';
    for (let i = 0; i < binary_string.length; ) {
      let curr_num = 0;
      for (let j = 0; j < 8; j++, i++) {
        curr_num *= 2;
        curr_num += binary_string[i] - '0';
      }
      encoded_data += String.fromCharCode(curr_num);
    }
    let tree_string = this.make_string(huffman_tree);
    let ts_length = tree_string.length;
    let final_string =
      ts_length.toString() +
      '#' +
      padding_length.toString() +
      '#' +
      tree_string +
      encoded_data;
    let output_message = 'Compression complete and file sent for download!';
    let ratio =
      'Compression Ratio : ' +
      (data.length / final_string.length).toPrecision(5);
    return [final_string, output_message, ratio];
  }

  // decoder function
  decode(data) {
    let k = 0;
    let temp = '';
    while (k < data.length && data[k] != '#') {
      temp += data[k];
      k++;
    }
    if (k == data.length) {
      alert(
        'Invalid File!\nPlease submit a valid compressed .txt file to decompress and try again!'
      );
      location.reload();
      return;
    }
    if (temp === 'zer') {
      let decoded_data = '';
      let output_message = 'Decompression complete and file sent for download!';
      return [decoded_data, output_message];
    }
    if (temp === 'one') {
      data = data.slice(k + 1);
      k = 0;
      temp = '';
      while (data[k] != '#') {
        temp += data[k];
        k++;
      }
      let one_char = temp;
      data = data.slice(k + 1);
      let str_len = parseInt(data);
      let decoded_data = '';
      for (let i = 0; i < str_len; i++) {
        decoded_data += one_char;
      }
      let output_message = 'Decompression complete and file sent for download!';
      return [decoded_data, output_message];
    }
    data = data.slice(k + 1);
    let ts_length = parseInt(temp);
    k = 0;
    temp = '';
    while (data[k] != '#') {
      temp += data[k];
      k++;
    }
    data = data.slice(k + 1);
    let padding_length = parseInt(temp);
    temp = '';
    for (k = 0; k < ts_length; k++) {
      temp += data[k];
    }
    data = data.slice(k);
    let tree_string = temp;
    temp = '';
    for (k = 0; k < data.length; k++) {
      temp += data[k];
    }
    let encoded_data = temp;
    this.index = 0;
    var huffman_tree = this.make_tree(tree_string);

    let binary_string = '';
    // retrieve binary string from encoded data
    for (let i = 0; i < encoded_data.length; i++) {
      let curr_num = encoded_data.charCodeAt(i);
      let curr_binary = '';
      for (let j = 7; j >= 0; j--) {
        let foo = curr_num >> j;
        curr_binary = curr_binary + (foo & 1);
      }
      binary_string += curr_binary;
    }
    // remove padding
    binary_string = binary_string.slice(0, -padding_length);

    // decode the data using binary string and huffman tree
    let decoded_data = '';
    let node = huffman_tree;
    for (let i = 0; i < binary_string.length; i++) {
      if (binary_string[i] === '1') {
        node = node[1];
      } else {
        node = node[0];
      }

      if (typeof node[0] === 'string') {
        decoded_data += node[0];
        node = huffman_tree;
      }
    }
    let output_message = 'Decompression complete and file sent for download!';
    return [decoded_data, output_message];
  }
}

// for accesing dom elements
uploadFile = document.getElementById('uploadfile');
upload = document.getElementById('upload');
action = document.getElementById('action');
wait = document.getElementById('wait');

isSubmitted = false;
codecObj = new Codec();

// called when submit button is clicked
submitBtnClick = () => {
  var uploadedFile = uploadFile.files[0];
  if (uploadedFile === undefined) {
    alert('No file uploaded!\nPlease upload a valid .txt file and try again.');
    return;
  }
  let nameSplit = uploadedFile.name.split('.');
  var extension = nameSplit[nameSplit.length - 1];
  if (extension != 'txt') {
    alert(
      'Invalid file type (.' +
        extension +
        ')!\nPlease upload a valid .txt file and try again.'
    );
    return;
  }
  alert('File submitted!');
  isSubmitted = true;
  onclickChanges('Done, File uploaded!', upload);
};

// called when compress button is clicked
encodeBtnClick = () => {
  var uploadedFile = uploadFile.files[0];
  if (uploadedFile === undefined) {
    alert('No file uploaded!\nPlease upload a file and try again.');
    return;
  }
  if (isSubmitted === false) {
    alert(
      'File not submitted!\nPlease click the submit button after uploading the file.'
    );
    return;
  }
  console.log(uploadedFile.size);
  if (uploadedFile.size === 0) {
    alert(
      "WARNING: You have uploaded an empty file!\nThe compressed file's size might be larger in size than the uncompressed file.\nBetter compression ratios are achieved for larger file sizes!"
    );
  } else if (uploadedFile.size <= 350) {
    alert(
      'WARNING: The uploaded file is very small in size (' +
        uploadedFile.size +
        " bytes) !\nThe compressed file's might be larger in size than the uncompressed file.\nBetter compression ratios are achieved for larger file sizes!"
    );
  } else if (uploadedFile.size < 1000) {
    alert(
      'WARNING: The uploaded file is small in size (' +
        uploadedFile.size +
        " bytes) !\nThe compressed file's size might be larger than expected.\nBetter compression ratios are achieved for larger file sizes!"
    );
  }
  onclickChanges('Done, Your file will be compressed!', action);
  onclickChanges2('Compressing your file...', 'compressed');

  var fileReader = new FileReader();
  fileReader.readAsText(uploadedFile, 'UTF-8');

  fileReader.onload = (fileLoadedEvent) => {
    let text = fileLoadedEvent.target.result;
    let [encodedString, outputMsg, ratio] = codecObj.encode(text);
    myDownloadFile(
      uploadedFile.name.split('.')[0] + '_compressed.txt',
      encodedString
    );
    ondownloadChanges(outputMsg, ratio);
  };
};

// called when decompress button is clicked
decodeBtnClick = () => {
  var uploadedFile = uploadFile.files[0];
  if (uploadedFile === undefined) {
    alert('No file uploaded!\nPlease upload a file and try again.');
    return;
  }
  if (isSubmitted === false) {
    alert(
      'File not submitted!\nPlease click the submit button after uploading the file.'
    );
    return;
  }
  onclickChanges('Done, Your file will be de-compressed!', action);
  onclickChanges2('De-compressing your file...', 'de-compressed');

  var fileReader = new FileReader();
  fileReader.readAsText(uploadedFile, 'UTF-8');
  fileReader.onload = (fileLoadedEvent) => {
    let text = fileLoadedEvent.target.result;
    let [decodedString, outputMsg] = codecObj.decode(text);
    myDownloadFile(
      uploadedFile.name.split('.')[0] + '_decompressed.txt',
      decodedString
    );
    ondownloadChanges(outputMsg);
  };
};

// changes dom for upload and select action
onclickChanges = (firstMsg, location) => {
  location.innerHTML = '';
  let img = document.createElement('img');
  img.src = 'assets/done_icon.jpg';
  img.className = 'doneImg';
  location.appendChild(img);
  var br = document.createElement('br');
  location.appendChild(br);
  let msg = document.createElement('span');
  msg.className = 'contentalign';
  msg.innerHTML = firstMsg;
  location.appendChild(msg);
};

// changes dom for wait
onclickChanges2 = (mainMsg, word) => {
  wait.innerHTML = '';
  let msg = document.createElement('span');
  msg.className = 'contentalign';
  msg.innerHTML =
    mainMsg + ', ' + word + ' file will be downloaded automatically!';
  wait.appendChild(msg);
};

// function to download file
myDownloadFile = (fileName, text) => {
  let a = document.createElement('a');
  a.href = 'data:application/octet-stream,' + encodeURIComponent(text);
  a.download = fileName;
  a.click();
};

// changed dom for wait when file is downloaded
ondownloadChanges = (outputMsg, ratio) => {
  wait.innerHTML = '';
  let img = document.createElement('img');
  img.src = 'assets/done_icon.jpg';
  img.className = 'doneImg';
  wait.appendChild(img);
  var br = document.createElement('br');
  wait.appendChild(br);
  let msg = document.createElement('span');
  msg.className = 'contentalign';
  msg.innerHTML = outputMsg;
  wait.appendChild(msg);
  if (ratio !== undefined) {
    var br = document.createElement('br');
    wait.appendChild(br);
    var ratio_ = document.createElement('span');
    ratio_.className = 'contentalign';
    ratio_.innerHTML = ratio;
    wait.appendChild(ratio_);
  }
};
