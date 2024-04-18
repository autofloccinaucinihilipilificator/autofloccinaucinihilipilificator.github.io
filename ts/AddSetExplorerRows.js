// JavaScript source code
const setList = document.getElementById('set-list');

setList.innerHTML = '';
for (let i = 0; i < 128; i++) {
    setList.insertAdjacentHTML('beforeend', `<tr style="background-color: var(--set-background-color-${i % 2 == 1 ? 2 : 1});">
    <td class="set-col"><button type="button"></button></td>
    <td class="button-col">
        <div class="set-buttons">
            <div class="delete-set"></div>
            <div class="edit-set"></div>
            <div class="set-arrows">
                <div class="set-up-arrow"></div>
                <div class="set-down-arrow"></div>
            </div>
        </div>
    </td>
</tr>`);
}