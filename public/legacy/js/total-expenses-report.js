/* إجمالي المصروفات: تقرير قراءة فقط من سجلات Supabase المسموح بها للحساب الحالي. */
(function(){
  'use strict';
  function teEsc_(value){return String(value==null?'':value).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];});}
  function teMoney_(amount){return new Intl.NumberFormat('ar-EG',{maximumFractionDigits:2}).format(amount)+' جنيه';}
  async function renderTotalExpenses_(){
    var tbody=document.querySelector('#totalExpensesTable tbody');
    var status=document.getElementById('total-expenses-status');
    var grand=document.getElementById('total-expenses-grand-total');
    if(!tbody||!status||!grand)return;
    var run=(window.__totalExpensesRenderRun__||0)+1;
    window.__totalExpensesRenderRun__=run;
    status.textContent='⏳ جاري تحميل الطلاب والدفعات من قاعدة البيانات…';
    grand.textContent='—';
    tbody.innerHTML='<tr><td colspan="5">جاري تحميل البيانات…</td></tr>';
    try{
      if(!window.MajdLocalDataAPI||typeof window.MajdLocalDataAPI.getPayments!=='function')throw new Error('واجهة قراءة المصروفات غير متاحة.');
      var payments=await window.MajdLocalDataAPI.getPayments();
      if(!Array.isArray(payments))throw new Error('لم تصل سجلات المصروفات بصيغة صحيحة.');
      payments=payments.filter(function(row){return row&&!row._deleted;});
      var allClasses=(Array.isArray(window.ALL_CLASSES)?window.ALL_CLASSES:[]).filter(function(c){return String(c).trim()&&String(c).trim()!=='الوافدين';});
      var classRank=new Map(allClasses.map(function(c,i){return [String(c),i];}));
      var students=(Array.isArray(window.studentsData)?window.studentsData:[]).filter(function(st){return st&&!st._deleted&&String(st.name||'').trim()&&String(st.className||'').trim()!=='الوافدين'&&classRank.has(String(st.className||''));});
      students.sort(function(a,b){return classRank.get(String(a.className))-classRank.get(String(b.className))||String(a.name||'').localeCompare(String(b.name||''),'ar');});
      var byId=new Map(),byNameClass=new Map(),nameClassCounts=new Map();
      students.forEach(function(st){var id=String(st.id||st.studentId||'');if(id)byId.set(id,st);var key=String(st.className||'')+'\u0000'+String(st.name||'').trim();nameClassCounts.set(key,(nameClassCounts.get(key)||0)+1);byNameClass.set(key,st);});
      var totals=new Map(),seenPayments=new Set(),unmatched=0,skippedAmbiguous=0;
      students.forEach(function(st){totals.set(st,0);});
      payments.forEach(function(row){
        var identity=String(row.recordId||row.id||'');
        if(identity&&seenPayments.has(identity))return;
        if(identity)seenPayments.add(identity);
        var student=null,paymentStudentId=String(row.studentId||'');
        if(paymentStudentId){student=byId.get(paymentStudentId)||null;if(!student)unmatched++;}
        else{
          var key=String(row.className||'')+'\u0000'+String(row.studentName||'').trim();
          if(nameClassCounts.get(key)===1)student=byNameClass.get(key)||null;
          else if(nameClassCounts.get(key)>1)skippedAmbiguous++;
          else unmatched++;
        }
        if(!student||String(student.className||'')==='الوافدين')return;
        var raw=row.amount;
        if(raw===null||raw===undefined||String(raw).trim()==='')throw new Error('توجد دفعة بلا مبلغ صالح؛ لم أعرض إجماليًا قد يكون مضللًا.');
        var amount=Number(raw);
        if(!Number.isFinite(amount)||amount<0)throw new Error('توجد دفعة بمبلغ غير صالح؛ لم أعرض إجماليًا قد يكون مضللًا.');
        totals.set(student,(totals.get(student)||0)+amount);
      });
      if(run!==window.__totalExpensesRenderRun__)return;
      var teachers=Array.isArray(window.teachersData)?window.teachersData:[];
      var serial=0,generalTotal=0,rows=[],activeClass='';
      students.forEach(function(st){
        var cls=String(st.className||''),amount=totals.get(st)||0;
        if(cls!==activeClass){activeClass=cls;rows.push('<tr class="total-expenses-class-row"><th colspan="5" style="text-align:right;background:var(--surface-alt);color:var(--primary-dark);border-top:2px solid var(--border-soft-strong);">'+teEsc_(cls)+'</th></tr>');}
        var assigned=teachers.filter(function(t){return t&&!t._deleted&&String(t.assignedClass||'')===cls&&String(t.username||'').trim().toLowerCase()!=='admin'&&String(t.assignedClass||'')!=='الكل';});
        var names=Array.from(new Set(assigned.map(function(t){return String(t.name||t.teacherName||t.fullName||t.username||'').trim();}).filter(Boolean)));
        var sheikh=names.length?names.join('، '):'—';
        serial++;generalTotal+=amount;
        rows.push('<tr><td>'+serial+'</td><td style="font-weight:700;">'+teEsc_(st.name)+'</td><td>'+teEsc_(cls)+'</td><td>'+teEsc_(sheikh)+'</td><td style="text-align:right;font-weight:700;white-space:nowrap;">'+teMoney_(amount)+'</td></tr>');
      });
      tbody.innerHTML=rows.length?rows.join(''):'<tr><td colspan="5" style="padding:20px;">لا يوجد طلاب عاديون مسجلون في الصفوف المعتمدة.</td></tr>';
      grand.textContent=teMoney_(generalTotal);
      status.textContent='تم تحميل '+serial+' طالبًا. مصدر الدفعات: Supabase.'+(unmatched?' تعذر ربط '+unmatched+' دفعة بسجل طالب متاح؛ لم تُحتسب حتى لا تُنسب خطأً.':'')+(skippedAmbiguous?' تم تخطي '+skippedAmbiguous+' دفعة بسبب تشابه الاسم والفصل.':'');
    }catch(error){
      if(run!==window.__totalExpensesRenderRun__)return;
      console.error('Total expenses report load failed:',error);
      tbody.innerHTML='<tr><td colspan="5" style="padding:20px;color:var(--danger-color);">تعذر تحميل التقرير. '+teEsc_(error&&error.message||'تحقق من اتصال قاعدة البيانات ثم أعد المحاولة.')+'</td></tr>';
      status.textContent='لم تُعرض أرقام تقديرية؛ أعد فتح التقرير بعد استعادة الاتصال.';
      grand.textContent='غير متاح';
    }
  }
  window.renderTotalExpenses_=renderTotalExpenses_;
})();
