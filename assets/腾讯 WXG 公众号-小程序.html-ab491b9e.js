import{_ as i,W as n,X as e,$ as l}from"./framework-731319f0.js";const d={},s=l(`<h1 id="腾讯-wxg-公众号-小程序" tabindex="-1"><a class="header-anchor" href="#腾讯-wxg-公众号-小程序" aria-hidden="true">#</a> 腾讯 WXG 公众号&amp;小程序</h1><h2 id="一面-2024-2-6" tabindex="-1"><a class="header-anchor" href="#一面-2024-2-6" aria-hidden="true">#</a> 一面 2024.2.6</h2><p>电话面试，上来先是5道题</p><p><img src="https://raw.githubusercontent.com/ClearDewy/TyporaImg/main/img/202403262345465.png" alt="1" loading="lazy"></p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>struct Node {
    int val;
    Node* next;
}

Node* solve(Node* A, Node* B) {
    Node *p;
    if(A-&gt;val&lt;=B-&gt;val){
        p=A;
        A=A-&gt;next;
    } else {
        p=B;
        B=B-&gt;val;
    }
    Node *q=p;
    while(A||B){
        if(!A||A-&gt;val&gt;B-&gt;val){
            q-&gt;next=B;
            B=B-&gt;next;
        } else {
            q-&gt;next=A;
            A=A-&gt;next;
        }
        q=q-&gt;next;
    }
    return p;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://raw.githubusercontent.com/ClearDewy/TyporaImg/main/img/202403262345926.png" alt="2" loading="lazy"></p><p>当时写的代码是</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int cal(int A1, int A2, int B1, int B2, int C1, int C2) {
    long long ans=0;
    for(int  i=A1;i&lt;=A2;i++){
        int l=B1,r=B2;
        while(l&lt;=r){
            int mid=l+r&gt;&gt;1;
            
            if(mid*mid+i*i&lt;c1) l=mid+1;
            else r=mid;
        }
        int ll=B1,rr=B2;
        while(ll&lt;=rr){
            int mid=ll+rr&gt;&gt;1;
            if(mid*mid+i*i&lt;c2) ll=mid+1;
            else rr=mid;

        }
        ans+=(ll-l+1);
    }
    return ans;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是面试官说有O(n)的做法，提示我式子有什么规律啥的。我想了一下，a增大，b就减小，说的是a从前找，b从后找，其实就是双指针，但是说不清楚。</p><p>补一下双指针做法：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int cal(int A1, int A2, int B1, int B2, int C1, int C2) {
	long long ans=0;
	for(int i=C1;i&lt;=C2;i++){
		int a=A1,b=B2;
		while(a&lt;=A2&amp;&amp;b&gt;=B1){
			long long sum=a*a+b*b;
			if(sum&lt;i) a++;
			else if(sum&gt;i) b--;
			else {
				a++,b--,ans++;
			}
		}
	}
	cout&lt;&lt;ans&lt;&lt;endl;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://raw.githubusercontent.com/ClearDewy/TyporaImg/main/img/202403262345304.png" alt="3" loading="lazy"></p><p>刚开始把题意理解错了，以为是两个数组格各选一个拼成第k大的数（脑子真是抽了）。后面面试官提示了现场想了一个二分大概，补充一下正确代码</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int a[100005]; //n
int b[100005]; //m

int FindKth(int n, int m, int k) {
	if(n&gt;m) FindKth(m,n,k);
	int l=0,r=n;
	while(l&lt;r){
		int amid=l+r&gt;&gt;1;
		int bmid=k-amid;
		if(bmid&gt;0&amp;&amp;bmid&lt;=m&amp;&amp;(amid==0||a[amid]&gt;=b[bmid-1])){
			if(bmid==m&amp;&amp;a[amid]&lt;=b[bmid-1]){
				return a[amid];
			}
			r=amid;
		} else {
			l=amid+1;
		}
	}
	if(l==0) return b[k-1];
	else if(l==k) return min(b[0],a[k-1]);
	else return b[k-l];
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://raw.githubusercontent.com/ClearDewy/TyporaImg/main/img/202403262345607.png" alt="4" loading="lazy"></p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int cap=2;
map&lt;int,pair&lt;int,list&lt;int&gt;&gt;cache;
list&lt;int&gt; lru;

int get(int key){
    if(cache.find(key)!=cache.end()) {
        lru.splice(lru.begin(),lru,cache[key].second);
        return cache[key].first;
    }
    return -1;
}

int set(int key,int val){
    if(cache.find(key)!=cache.end()) {
        cache[key].first=val;
        lru.splice(lru.begin(),lru,cache[key].second);
    } else {
        if(cache.size()&gt;=cap){
            int back=lru.back();
            cache.erase(back);
            lru.pop_back();
        }
        lru.push_front(key);
        cache[key]={val,lru.begin()};
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://raw.githubusercontent.com/ClearDewy/TyporaImg/main/img/202403262345156.png" alt="5" loading="lazy"></p><p>很综合的一道题，什么都考了。</p><p>根据注1，我说明数据量过大，可以使用hash进行存储，方便查找。针对索引可以使用B+树，这样就可以遍历子节点得到想要的数据。如果不想数据丢失可以进行备份，序列化存储于磁盘中。关于对值的更新和新增，注意先在数据库中删除数据，再更新缓存，避免脏读幻读。同时，数据量过大时，可以使用LRU，这样对于数据的查找会方便许多。关于并发读写，可以采用读写锁，避免数据不一致。</p><p>面试官提问：</p><p>1、关于你的序列化存储是怎么个序列化存储（我说数据以结构体的形式存在磁盘中）</p><p>在序列化过程中，对象的公共字段、私有字段和其他构成部分被线性化，转换成一个字节序列。这可能包括对象的类型信息、对象字段的值等。一旦数据被序列化成字节序列，它就可以被存储到磁盘、数据库或通过网络发送到另一个系统。</p><p>2、数据是怎么存入磁盘的，是写在磁盘哪儿的（没怎么回答上来，说了内存映射）</p><p>a.文件系统</p><ul><li>管理数据：操作系统通过文件系统来管理硬盘上的数据。文件系统决定了数据如何被组织、存储和检索。常见的文件系统包括 NTFS（Windows）、EXT4（Linux）、APFS（macOS）等。</li><li>分配空间：文件系统在硬盘上维护一个或多个分区，每个分区有自己的组织结构。当数据被写入磁盘时，文件系统负责在分区内找到空间来存储这些数据。</li></ul><p>b. 数据组织</p><ul><li>文件和目录：文件系统以文件和目录的形式组织数据。用户和应用程序将数据写入文件，而文件被存储在目录中。</li><li>元数据：文件系统还存储关于文件的元数据，比如文件大小、创建和修改日期、权限等。</li></ul><p>c.物理存储</p><ul><li>磁盘扇区：磁盘被划分为扇区，扇区是磁盘存储的最小单位。每个扇区通常存储 512 字节或 4K 字节的数据。</li><li>写入数据：当文件被写入磁盘时，数据被分割成多个部分，这些部分被存储在一个或多个扇区中。文件系统负责管理这些扇区的位置。</li></ul><p>d. 数据访问</p><ul><li>读/写头：硬盘驱动器有一个读/写头，用于在磁盘表面的磁道上读取或写入数据。</li><li>旋转磁盘：传统的机械硬盘通过旋转磁盘来访问数据。读/写头移动到正确的磁道，然后等待磁盘旋转到正确的位置以访问数据。</li><li>固态驱动器：在固态硬盘（SSD）中，数据存储在闪存芯片上，无需移动读/写头，因此数据访问速度更快。</li></ul><p>e. 逻辑到物理的映射</p><ul><li>逻辑块地址：文件系统通常以逻辑块地址（LBA）来访问硬盘。LBA是一个抽象的地址，文件系统通过它来指定存储数据的位置。</li><li>映射：硬盘固件将逻辑块地址映射到物理扇区地址。</li></ul><p>2、B+树的叶子节点存了所有数据吗（我说是的）</p><p>B+树索引的具体内容存储取决于索引的类型。对于主键索引（聚簇索引），叶子节点确实存储了所有的数据行。在聚簇索引中，表中的数据实际上存储在索引的叶子节点上；对于辅助索引（非聚簇索引），叶子节点不存储完整的数据行。相反，每个叶子节点包含了辅助索引的键值和指向对应主键索引记录的指针（即主键的值）。</p><p>3、如果说磁盘损坏了怎么办？云服务也不行怎么办？（我说可以参考redis主从服务，主服务器损坏，可以使用从服务器）</p><p>4、怎样保证主从服务器数据一致（我说只看过一点，先将数据传入主服务器中，然后由主服务器发出命令，更改所有从服务器）</p><h2 id="二面-2024-2-22" tabindex="-1"><a class="header-anchor" href="#二面-2024-2-22" aria-hidden="true">#</a> 二面 2024.2.22</h2><p>算法题三道</p><p><img src="https://raw.githubusercontent.com/ClearDewy/TyporaImg/main/img/202403262345148.png" alt="6" loading="lazy"></p><p>O(n)做法</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>要求需要比O(n)更小</p><p><img src="https://raw.githubusercontent.com/ClearDewy/TyporaImg/main/img/202403262346245.png" alt="7" loading="lazy"></p><p><img src="https://raw.githubusercontent.com/ClearDewy/TyporaImg/main/img/202403262346872.png" alt="7" loading="lazy"></p><p>项目：</p><p>1、青训营项目测压能够承受的最大数据量是多少</p><p>2、测压有什么数据</p><p>3、关于etcd指出不足的地方：etcd的服务注册与发现应该是横向拓展，但是项目中每个板块都只用了一个服务，其实不符合分布式的说法</p>`,49),a=[s];function t(r,v){return n(),e("div",null,a)}const m=i(d,[["render",t],["__file","腾讯 WXG 公众号-小程序.html.vue"]]);export{m as default};
