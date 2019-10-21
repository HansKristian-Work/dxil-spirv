#include "structurize_cfg.hpp"
#include <stdio.h>
using namespace DXIL2SPIRV;

int main()
{
	CFGNode l, l0, l1, le;
	CFGNode a, a0, a1, ae;
	CFGNode b, b0, b1, be;

	l.name = "l";
	l0.name = "l0";
	l1.name = "l1";
	le.name = "le";

	a.name = "a";
	a0.name = "a0";
	a1.name = "a1";
	ae.name = "ae";

	b.name = "b";
	b0.name = "b0";
	b1.name = "b1";
	be.name = "be";

	l.add_branch(&a);
	l.add_branch(&b);

	a.add_branch(&a0);
	a.add_branch(&a1);
	a0.add_branch(&ae);
	a1.add_branch(&ae);
	ae.add_branch(&l0);

	b.add_branch(&b0);
	b.add_branch(&b1);
	b0.add_branch(&be);
	b1.add_branch(&be);
	be.add_branch(&l1);

	l0.add_branch(&le);
	l1.add_branch(&le);

	CFGStructurizer traverser(l);
	printf("Hai!\n");
}