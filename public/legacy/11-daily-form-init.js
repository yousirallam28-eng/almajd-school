window.addEventListener('DOMContentLoaded', function () { try {
    markDailyTypeFieldGroups_();
    selectDailyGradeType('new');
}
catch (e) {
    console.warn('daily type UI init', e);
} });
