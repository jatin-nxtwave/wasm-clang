/*
 * Copyright 2020 WebAssembly Community Group participants
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const LAYOUT_CONFIG_KEY = 'layoutConfig';

const initialProgram =
`#include <canva.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // Test vector, sort, unique
    vector<int> v = {5, 1, 2, 2, 3, 9, 5};
    sort(v.begin(), v.end());
    v.erase(unique(v.begin(), v.end()), v.end());

    cout << "Vector contents:";
    for (int x : v) cout << " " << x;
    cout << "\n";

    // Test map + string
    map<string, int> freq;
    string s = "abracadabra";
    for (char c : s) freq[string(1, c)]++;

    cout << "Map contents:\n";
    for (auto &p : freq) {
        cout << p.first << " -> " << p.second << "\n";
    }

    // Test set + lower_bound
    set<int> st(v.begin(), v.end());
    auto it = st.lower_bound(4);
    if (it != st.end()) cout << "First element >= 4: " << *it << "\n";

    // Test queue + stack
    queue<int> q;
    stack<int> stck;
    for (int i = 1; i <= 5; i++) { q.push(i); stck.push(i); }

    cout << "Queue front: " << q.front() << ", back: " << q.back() << "\n";
    cout << "Stack top: " << stck.top() << "\n";

    // Test random + chrono
    mt19937 rng(123);
    uniform_int_distribution<int> dist(1, 100);
    cout << "Random number: " << dist(rng) << "\n";

    auto start = chrono::high_resolution_clock::now();
    long long sum = 0;
    for (int i = 0; i < 1e5; i++) sum += i;
    auto end = chrono::high_resolution_clock::now();
    cout << "Sum: " << sum << ", elapsed ms: "
         << chrono::duration_cast<chrono::milliseconds>(end - start).count() << "\n";

    return 0;
}
`;

// Golden Layout
let layout = null;

function initLayout() {
  const defaultLayoutConfig = {
    settings: {
      showCloseIcon: false,
      showPopoutIcon: false,
    },
    content: [{
      type: 'row',
      content: [{
        type: 'component',
        componentName: 'editor',
        componentState: {fontSize: 18, value: initialProgram},
      }, {
        type: 'stack',
        content: [{
          type: 'component',
          componentName: 'terminal',
          componentState: {fontSize: 18},
        }, {
          type: 'component',
          componentName: 'canvas',
        }]
      }]
    }]
  };

  layout = new Layout({
    configKey: LAYOUT_CONFIG_KEY,
    defaultLayoutConfig,
  });

  layout.on('initialised', event => {
    // Editor stuff
    editor.commands.addCommand({
      name: 'run',
      bindKey: {win: 'Ctrl+Enter', mac: 'Command+Enter'},
      exec: run
    });
  });

  layout.registerComponent('canvas', CanvasComponent);
  layout.init();
}

function resetLayout() {
  localStorage.removeItem('layoutConfig');
  if (layout) {
    layout.destroy();
    layout = null;
  }
  initLayout();
}

// Toolbar stuff
$('#reset').on('click', event => { if (confirm('really reset?')) resetLayout() });
$('#run').on('click', event => run(editor));


initLayout();
