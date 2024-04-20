// JavaScript source code
const setList = document.getElementById('set-list');

setList.innerHTML = '';
for (let i = 0; i < 128; i++) {
    setList.insertAdjacentHTML('beforeend', `<tr style="background-color: var(--set-background-color-${i % 2 == 1 ? 2 : 1});">
    <td class="set-col"><button type="button"></button></td>
    <td class="button-col">
        <div class="set-buttons">
            <div class="delete-set" title="Delete set"><div></div></div>
            <div class="edit-set" title="Edit set"><div><div></div></div></div>
            <div class="set-arrows">
                <div class="set-up-arrow" title="Move set up"><div></div></div>
                <div class="set-down-arrow" title="Move set down"><div></div></div>
            </div>
        </div>
    </td>
</tr>`);
}