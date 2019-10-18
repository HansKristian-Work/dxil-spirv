#pragma once

#include <vector>
#include <stdint.h>

namespace DXIL2SPIRV
{
struct CFGNode
{
	uint32_t id = 0;
	uint32_t visit_order = 0;
	bool visited = false;
	bool is_back_edge = false;

	std::vector<CFGNode *> succ;
	std::vector<CFGNode *> pred;

	void add_unique_succ(CFGNode *node);
	void add_unique_pred(CFGNode *node);
};

class CFGPostOrderTraverser
{
public:
	explicit CFGPostOrderTraverser(CFGNode &entry);

private:
	std::vector<CFGNode *> post_visit_order;
	void visit(CFGNode &entry);
};

class CFGStructurizer
{
public:
	explicit CFGStructurizer(const CFGPostOrderTraverser &cfg);
};

}