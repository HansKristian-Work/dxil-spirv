#include "structurize_cfg.hpp"
#include <algorithm>

namespace DXIL2SPIRV
{
CFGPostOrderTraverser::CFGPostOrderTraverser(CFGNode &entry)
{
	visit(entry);
}

void CFGNode::add_unique_pred(CFGNode *node)
{
	auto itr = std::find(pred.begin(), pred.end(), node);
	if (itr == pred.end())
		pred.push_back(node);
}

void CFGNode::add_unique_succ(CFGNode *node)
{
	auto itr = std::find(succ.begin(), succ.end(), node);
	if (itr == succ.end())
		succ.push_back(node);
}

void CFGPostOrderTraverser::visit(CFGNode &entry)
{
	entry.visited = true;

	for (auto *succ : entry.succ)
	{
		succ->add_unique_pred(&entry);
		if (succ->visited)
			entry.is_back_edge = true;
		else
			visit(*succ);
	}

	entry.visit_order = post_visit_order.size();
	post_visit_order.push_back(&entry);
}
}